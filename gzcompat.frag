// Required for following defines
in vec3 v_normal;
in vec4 v_position;
in vec2 v_texcoord;
in vec4 vTexCoord;
uniform mat4 u_modelViewProjectionMatrix;
uniform sampler2D u_tex0;

// You must declare this uniform yourself in order to use it
uniform float u_time;

mat4 _normalMatrixFrom(mat4 matrix)
{
    mat3 subtrix = mat3(
        matrix[0][0], \
        matrix[0][1], \
        matrix[0][2], \
        matrix[1][0], \
        matrix[1][1], \
        matrix[1][2], \
        matrix[2][0], \
        matrix[2][1], \
        matrix[2][2]
    );
    float det = determinant(subtrix);
    float invDet = 1./det;
    return mat4(subtrix * invDet);
}

//===========================================================================
//
// Desaturate a color. Copied from GZDoom source code
//
//===========================================================================

float grayscale(vec4 color)
{
	return dot(color.rgb, vec3(0.3, 0.56, 0.14));
}

vec4 dodesaturate(vec4 texel, float factor)
{
	if (factor != 0.0)
	{
		float gray = grayscale(texel);
		return mix (texel, vec4(gray,gray,gray,texel.a), factor);
	}
	else
	{
		return texel;
	}
}

#define uDesaturationFactor .5

vec4 desaturate(vec4 texel)
{
	return dodesaturate(texel, uDesaturationFactor);
}

// Defines and prototypes for GZDoom compatibility
#define tex u_tex0
#define vTexCoord vec4(v_texcoord.x, 1. - v_texcoord.y, 0., 1.)
#define timer u_time
#define vWorldNormal vec4(v_normal, 1.)
#define vEyeNormal (_normalMatrixFrom(u_modelViewProjectionMatrix) * vec4(v_normal, 1.))
#ifdef MODEL_PRIMITIVE_TRIANGLES
#define pixelpos vec4(v_position.xyz, (u_modelViewProjectionMatrix * v_position).z)
#else
#define pixelpos vec4(1.)
#endif

vec4 FragColor;

// Take care of a GLSL compiler warning
// out vec4 gl_FragColor;

vec4 getTexel(vec2 uv)
{
    return texture(u_tex0, uv);
}
#ifdef TEXTURE_SHADER
vec4 Process(vec4 color);
void main()
{
	FragColor = Process(vec4(1.0));
	gl_FragColor = FragColor;
}
#endif
