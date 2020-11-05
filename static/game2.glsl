#ifdef VERT

in vec2 clipspace;

uniform vec2 canvassize;
uniform vec2 mouse;

uniform vec4 playerpos[10];
uniform int playerid;

out vec2 uv;
out vec3 ro;
out vec3 lookAt;

void main() {
  uv = clipspace * (canvassize.xy / canvassize.y);
  float d = 4.0;
  ro = vec3(d * cos(mouse.x), 0.1 + d * mouse.y, d * sin(mouse.x)) +
       playerpos[playerid].xyz;
  lookAt = vec3(0.0) + playerpos[playerid].xyz;
  gl_Position = vec4(clipspace, 0.0, 1.0);
}

#endif

///////////////////////////////////////////////////////////////////////////////

#ifdef FRAG

in vec2 uv;
in vec3 ro;
in vec3 lookAt;

// uniform float time;
uniform int Nplayers;
uniform vec4 playerpos[10]; // Nplayers here, or just Nmaxplayers...
uniform vec3 playercol[10];

uniform sampler2D metaltex;
uniform sampler2D metaltexspec;
uniform sampler2D metaltexnormal;

out vec4 fragcolor;

const vec3 lightpos = vec3(0.0, 20.0, 0.0);
const vec3 lightcolor = vec3(1.0, 0.94, 0.87);

// return distance and which model number is closest to p
vec2 map(vec3 p) {
  float d = 10000000.0;
  float n = 0.0;
  float t;

  for (int i = 0; i < Nplayers; i++) {
    t = sdSphere(p, playerpos[i]);
    if (t < d) {
      n = float(i);
      d = t;
    }
  }
  return vec2(d, n);
}

// return distance and which model number was hit by ray
vec2 raymarch(vec3 ro, vec3 rd) {
  // nothing (aka sky)
  vec2 res = vec2(-1.0, -2.0);

  // ground
  // float ground = iPlane(ro, rd, vec4(0.0, 1.0, 0.0, 0.0));
  float ground =
      -ro.y /
      rd.y; // iPlane simplifies to this if plane=vec4(0.0, 1.0, 0.0, 0.0)
  if (ground > 0.0) {
    res = vec2(ground, -1.0);
  }

  float t = 0.0;
  for (int i = 0; i < 20; i++) {
    vec2 h = map(ro + rd * t);
    if (h.x < 0.001 * t) {
      res = vec2(t, h.y);
      break;
    }
    t += h.x;
  }
  return res;
}

// return distance and which model number was hit by ray (without marching aka
// raytrace)
vec2 raytrace(vec3 ro, vec3 rd) {
  // nothing (aka sky)
  vec2 res = vec2(-1.0, -2.0);

  // ground
  float ground = -ro.y / rd.y;
  if (ground > 0.0) {
    res = vec2(ground, -1.0);
  }

  float t = 0.0;
  float d = 10000000.0;
  for (int i = 0; i < Nplayers; i++) {
    t = iSphere(ro, rd, playerpos[i]);
    if (t > 0.0 && t < d) { // ray hit a sphere and is closer than current d
      d = min(t, d);
      res = vec2(d, float(i));
    }
  }
  return res;
}

vec3 skycolor(vec3 rd) { return vec3(0.7, 0.7, 0.9) - max(rd.y, 0.0) * 0.3; }

vec3 groundcolor(vec3 rd, vec3 p) {
  vec3 V = normalize(-rd);
  vec3 N = vec3(0.0, 1.0, 0.0);
  vec3 L = normalize(lightpos - p);
  // vec3 H = normalize(V+L);

  vec3 tex = texture(metaltex, fract(p.xz)).xyz;
  vec3 albedo = tex;
  float iswhitesquare = checkersTexture(p.xz);
  albedo *= (0.5 + iswhitesquare * 0.5);

  float ao = 0.05;
  vec3 ambient = albedo * ao;

  float metallic = tex.x * 0.5;
  vec3 F0 = mix(vec3(0.02), albedo, metallic);
  float lightstrength = 1000.0;
  float roughness = 1.0 - metallic;
  // float roughness = 0.66;
  vec3 Lo = CookTorranceBRDF(N, V, p, lightpos, lightcolor, lightstrength, F0,
                             albedo, roughness, metallic);

  float k = 2.0; // hardness of shadow
  for (int i = 0; i < Nplayers; i++) {
    Lo *= sphSoftShadow(p, L, playerpos[i], k);
  }

  vec3 color = ambient + Lo;
  return color;
}

vec2 spherenormal2uv(vec3 N) {
  float u = atan(N.z, N.x) / PI + 0.5;
  float v = 0.5 * N.y + 0.5;
  return vec2(u, v);
  // return vec2(u*0.75,v*0.75); //texture is a bit too fine grained. make
  // features "larger"
}

vec3 spherecolor(vec3 rd, vec3 p, float m) {
  vec3 V = normalize(-rd);
  vec3 N = sphNormal(p, playerpos[int(m)]);
  vec3 L = normalize(lightpos - p);
  // vec3 H = normalize(V+L);

  vec3 tex = texture(metaltex, spherenormal2uv(N)).xyz;
  vec3 albedo = mix(playercol[int(m)], tex, 0.66);

  float ao = 0.05;
  vec3 ambient = albedo * ao;

  float metallic = albedo.x * 0.5;
  vec3 F0 = mix(vec3(0.02), albedo, metallic);
  float lightstrength = 1000.0;
  // float roughness = 1.0-metallic;
  float roughness = 0.66;
  vec3 Lo = CookTorranceBRDF(N, V, p, lightpos, lightcolor, lightstrength, F0,
                             albedo, roughness, metallic);

  float k = 2.0; // hardness of shadow
  for (int i = 0; i < Nplayers; i++) {
    Lo *= sphSoftShadow(p, L, playerpos[i], k);
  }

  vec3 color = ambient + Lo;
  return color;
}

// models
//-2: sky
//-1: ground
// 0,1,2 etc: players

// return pixel color
vec3 render(vec3 ro, vec3 rd) {
  vec3 col = vec3(0.0);

  // raymarch scene
  // vec2 res = raymarch(ro, rd);
  vec2 res = raytrace(ro, rd);
  float t = res.x;
  float m = res.y; // model number
  vec3 pos = ro + t * rd;

  if (m < -1.5) {
    col = skycolor(rd);
  } else if (m < -0.5) {
    col = groundcolor(rd, pos);
  } else {
    col = spherecolor(rd, pos, m);
  }

  return col;
}

void main(void) {
  vec3 rd = raydir(uv, ro, lookAt);
  vec3 col = render(ro, rd);
  fragcolor = vec4(col, 1.0);
}

#endif
