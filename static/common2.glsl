#version 300 es
precision mediump float;
precision mediump sampler2D;

const float PI = 3.14159265359;

vec3 raydir(vec2 uv, vec3 ro, vec3 lookAt) {
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 forward = normalize(lookAt - ro);
  vec3 right = normalize(cross(forward, up));
  vec3 upward = cross(right, forward);
  float fov = 1.0;
  float dist = 0.5 / tan(fov * 0.5);
  return normalize(forward * dist + right * uv.x + upward * uv.y);
}

float checkersTexture(vec2 p) {
  vec2 q = floor(p);
  return mod(q.x + q.y, 2.0);
}

float sdSphere(vec3 p, vec4 sph) { return length(p - sph.xyz) - sph.w; }

// Distance functions
// return Normal at the intersection point and distance to it
// vec4(Normal, distance)

// Adapted from:
// https://www.iquilezles.org/www/articles/intersectors/intersectors.htm

// plane degined by p (p.xyz must be normalized)
vec4 plaIntersect(vec3 ro, vec3 rd, vec4 p) {
  vec3 N = p.xyz;
  float dist = -(dot(ro, N) + p.w) / dot(rd, N);
  return vec4(N, dist);
}

// sphere of size ra centered at point ce
// assume ro is not inside sphere
vec4 sphIntersect(vec3 ro, vec3 rd, vec3 ce, float ra) {
  vec3 oc = ro - ce;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - ra * ra;
  float h = b * b - c;
  if (h < 0.0)
    return vec4(-1.0); // no intersection
  h = sqrt(h);
  float dist = h - b;
  vec3 p = ro + rd * dist;
  vec3 N = normalize(p - ce);
  return vec4(N, dist);
}

float iSphere(vec3 ro, vec3 rd, vec4 sph) {
  vec3 oc = ro - sph.xyz;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - sph.w * sph.w;
  float h = b * b - c;
  if (h < 0.0) 
    return -1.0; // no intersection
  h = sqrt(h);
  return -h - b;
}

float iPlane(vec3 ro, vec3 rd, vec4 pla) {
  return -(dot(ro, pla.xyz) + pla.w) / dot(rd, pla.xyz); //negative if no intersection
}

float sphSoftShadow(vec3 ro, vec3 rd, vec4 sph, float k) {
	vec3 oc = ro - sph.xyz;
	float b = dot(oc, rd);
	float c = dot(oc, oc) - sph.w*sph.w;
	float h = b*b - c;
	float d = -sph.w + sqrt(max(0.0, sph.w*sph.w-h));
	float t = -b - sqrt(max(0.0,h));
	return (t<0.0) ? 1.0 : smoothstep(0.0, 1.0, k*d/t);
}
 

vec3 sphNormal(vec3 pos, vec4 sph) {
  return normalize(pos-sph.xyz);
}


//Physically Based Rendering (PBR)
float clamp01(float x) {
    return clamp(x, 0.0, 1.0);
}

float max0(float x ) {
    return max(0.0, x);
}

vec3 fresnelSchlick(float VH, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - VH, 5.0);
}

float DistributionGGX(float NH, float roughness) {
  float a = roughness*roughness;
  float a2 = a*a;
  float r = (NH * NH * (a2 - 1.0) + 1.0);
  return a2 / max(PI * r * r, 0.001);
}

float GeometrySchlickGGX(float NV, float roughness) {
  float r = roughness + 1.0;
  float k = r*r / 8.0;
  return NV / (NV * (1.0 - k) + k);
}

float GeometrySmith(float NV, float NL, float roughness) {
    return GeometrySchlickGGX(NV, roughness) * GeometrySchlickGGX(NL, roughness);
}

vec3 CookTorranceBRDF(vec3 N, vec3 V, vec3 p, vec3 lightpos, vec3 lightcolor, float lightstrength, vec3 F0, vec3 albedo, float roughness, float metallic) {
  vec3 L = normalize(lightpos - p);
  vec3 H = normalize(V + L);
  float NL = max0(dot(N, L));
  float NV = max0(dot(N, V));
  float NH = max0(dot(N, H));
  float HV = clamp01(dot(H, V));
  float d = length(lightpos - p);
  vec3 radiance = lightstrength*lightcolor / (d*d);

  float NDF = DistributionGGX(NH, roughness);   
  float G = GeometrySmith(NV, NL, roughness);
  vec3 F = fresnelSchlick(HV, F0);
  vec3 diffuse = (vec3(1.0) - F)*(1.0 - metallic);
  vec3 specular = NDF * G * F / max(4.0 * NV * NL, 0.001);
	
  vec3 spec = (diffuse * albedo / PI + specular) * radiance * NL;
  return spec;
}
