#ifdef VERT

in vec2 clipspace;

uniform vec2 canvassize;
uniform vec2 mouse;

out vec2 uv;
out vec3 ro;
out vec3 lookAt;

void main() {
  uv = clipspace*(canvassize.xy/canvassize.y);
  ro = vec3(4.0*cos(mouse.x), 4.0*mouse.y, 4.0*sin(mouse.x));
  lookAt = vec3(0.0);
  gl_Position = vec4(clipspace, 0.0, 1.0);
}

#endif

///////////////////////////////////////////////////////////////////////////////

#ifdef FRAG

in vec2 uv;
in vec3 ro;
in vec3 lookAt;

out vec4 fragcolor;

vec2 opU(vec2 d1, vec2 d2) {
	return (d1.x<d2.x) ? d1 : d2;
}

vec2 map(vec3 pos ) {
  vec2 res = vec2(1e10, 0.0);
  vec3 ballpos = vec3(0.0, 0.4, 0.0);
  float ballradius = 0.4;

  vec3 ballpos2 = vec3(4.0, 0.2, 0.0);
  float ballradius2 = 0.2;

  res = opU(res, vec2(sdSphere(pos-ballpos, ballradius), 21.9));
  res = opU(res, vec2(sdSphere(pos-ballpos2, ballradius2), 25.9));
  return res;
}


vec2 raycast(vec3 ro, vec3 rd) {
  vec2 res = vec2(-1.0, -1.0);
  float tmax = 20.0;

  //floor
  float tp1 = (0.0-ro.y)/rd.y;
  if( tp1>0.0 ) {
    tmax = min(tmax, tp1);
    res = vec2( tp1, 1.0 );
  }


  vec3 bodyroot = vec3(0.0);
  vec2 bound = iSphere(ro, rd, bodyroot, 4.0); //only raymarch within this sphere
  float t = bound.x; //min
  tmax = min(tmax, bound.y); //max

  if(t>0.0) {
    for(int i=0; i<20 && t<tmax; i++) {
      vec2 h = map(ro + rd*t);
      //h.x = min(0.1, h.x); //limit stepsize cuz overstepping.
      if(abs(h.x)<(0.001*t)) {
        res = vec2(t,h.y);
        break;
      }
      t += h.x;
    }
  }
  return res;
}

float calcSoftshadow(vec3 ro, vec3 rd, float mint, float tmax) {
  // bounding volume
  float tp = (0.8-ro.y)/rd.y; if( tp>0.0 ) tmax = min( tmax, tp );
  float res = 1.0;
  float t = mint;
  for( int i=0; i<16; i++ ) {
  float h = map( ro + rd*t ).x;
    float s = clamp(8.0*h/t,0.0,1.0);
    res = min( res, s*s*(3.0-2.0*s) );
    t += clamp( h, 0.02, 0.10 );
    if( res<0.005 || t>tmax ) break;
  }
  return clamp( res, 0.0, 1.0 );
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal(vec3 pos) {
  vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
  return normalize(e.xyy*map( pos + e.xyy ).x + e.yyx*map( pos + e.yyx ).x + e.yxy*map( pos + e.yxy ).x + e.xxx*map( pos + e.xxx ).x);
}

float calcAO(vec3 pos, vec3 nor) {
	float occ = 0.0;
  float sca = 1.0;
  for( int i=0; i<5; i++ ) {
    float h = 0.01 + 0.12*float(i)/4.0;
    float d = map( pos + h*nor ).x;
    occ += (h-d)*sca;
    sca *= 0.95;
    if( occ>0.35 ) break;
  }
  return clamp( 1.0 - 3.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.y);
}

float checkersTexture(vec2 p) {
  vec2 q = floor(p);
  return mod(q.x+q.y, 2.0);
}

vec3 render(vec3 ro, vec3 rd) {
  // background
  vec3 col = vec3(0.7, 0.7, 0.9) - max(rd.y,0.0)*0.3;
  
  // raycast scene
  vec2 res = raycast(ro,rd);
  float t = res.x;
	float m = res.y; //model number
  if( m>-0.5 ) {
    vec3 pos = ro + t*rd;
    vec3 nor = (m<1.5) ? vec3(0.0,1.0,0.0) : calcNormal( pos );
    vec3 ref = reflect( rd, nor );
    
    // material        
    col = 0.2 + 0.2*sin(2.0*m + vec3(0.0, 1.0, 2.0));
    float ks = 1.0;
    
    if (m<1.5) {
        float f = checkersTexture(pos.xz);
        col = 0.15 + f*vec3(0.05);
        ks = 0.4;
    }

    // lighting
    float occ = calcAO(pos, nor);
    vec3 lin = vec3(0.0);

    // sun
    {
      vec3  lig = normalize( vec3(-0.5, 0.4, -0.6) );
      vec3  hal = normalize( lig-rd );
      float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
      dif *= calcSoftshadow( pos, lig, 0.02, 2.5 );
      float spe = pow( clamp( dot( nor, hal ), 0.0, 1.0 ),16.0);
      spe *= dif;
      spe *= 0.04+0.96*pow(clamp(1.0-dot(hal,lig),0.0,1.0),5.0);
      lin += col*2.20*dif*vec3(1.30,1.00,0.70);
      lin += 5.00*spe*vec3(1.30,1.00,0.70)*ks;
    }
    // sky
    {
      float dif = sqrt(clamp( 0.5+0.5*nor.y, 0.0, 1.0 ));
      dif *= occ;
      float spe = smoothstep( -0.2, 0.2, ref.y );
      spe *= dif;
      spe *= calcSoftshadow( pos, ref, 0.02, 2.5 );
      spe *= 0.04+0.96*pow(clamp(1.0+dot(nor,rd),0.0,1.0), 5.0 );
      lin += col*0.60*dif*vec3(0.40,0.60,1.15);
      lin += 2.00*spe*vec3(0.40,0.60,1.30)*ks;
    }
    // back
    {
      float dif = clamp( dot( nor, normalize(vec3(0.5,0.0,0.6))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
      dif *= occ;
      lin += col*0.55*dif*vec3(0.25,0.25,0.25);
    }
    // sss
    {
      float dif = pow(clamp(1.0+dot(nor,rd),0.0,1.0),2.0);
      dif *= occ;
      lin += col*0.25*dif*vec3(1.00,1.00,1.00);
    }
    
    col = lin;
    col = mix( col, vec3(0.7,0.7,0.9), 1.0-exp( -0.0001*t*t*t ) );
  }
	return vec3( clamp(col,0.0,1.0) );
}

void main(void) {
  vec3 rd = raydir(uv, ro, lookAt);
  vec3 col = render(ro, rd);
  col = pow(col, vec3(0.4545));
  fragcolor = vec4(col, 1.0);
}

#endif