struct VertexInput {
    @location(0) position : vec3f,
    @location(1) texcoords : vec2f,
    @location(2) normal : vec3f,
}

struct VertexOutput {
    @builtin(position) clipPosition : vec4f,
    @location(0) position : vec3f,
    @location(1) texcoords : vec2f,
    @location(2) normal : vec3f,
}

struct FragmentInput {
    @builtin(position) clipPosition : vec4f,
    @location(0) position : vec3f,
    @location(1) texcoords : vec2f,
    @location(2) normal : vec3f,
}

struct FragmentOutput {
    @location(0) color : vec4f,
}



struct CameraUniforms {
    viewMatrix : mat4x4f,
    projectionMatrix : mat4x4f,
}

struct ModelUniforms {
    modelMatrix : mat4x4f,
    normalMatrix : mat3x3f,
}

struct MaterialUniforms {
    baseFactor : vec4f,
}

struct LightUniforms {
    position : vec3f,
    ambient : f32,
}

struct customUniforms {
    u_resolution : vec2f,
    u_time : f32,
    u_frame : f32,
}


@group(0) @binding(0) var<uniform> camera : CameraUniforms;
@group(1) @binding(0) var<uniform> model : ModelUniforms;
@group(2) @binding(0) var<uniform> material : MaterialUniforms;
@group(2) @binding(1) var baseTexture : texture_2d<f32>;
@group(2) @binding(2) var baseSampler : sampler;
@group(3) @binding(0) var<uniform> light : LightUniforms;
@group(3) @binding(1) var<uniform> custom : customUniforms;

@vertex
fn vertex(input : VertexInput) -> VertexOutput {
    var output : VertexOutput;

    output.clipPosition = camera.projectionMatrix * camera.viewMatrix * model.modelMatrix * vec4(input.position, 1);

    output.position = (model.modelMatrix * vec4(input.position, 1)).xyz;
    output.texcoords = input.texcoords;
    output.normal = normalize(model.normalMatrix * input.normal);

    return output;
}

struct mat2 {
    col1: vec2f,
    col2: vec2f,
};

fn circle(pixel : vec2f, center : vec2f, radius : f32) -> f32 {
    return 1.0 - smoothstep(radius - 1.0, radius + 1.0, length(pixel - center));
}

fn rotate(angle: f32) -> mat2x2<f32> {
    return mat2x2<f32>(cos(angle), -sin(angle), sin(angle), cos(angle));
}

fn diffuseFactor(normal : vec3f, light_direction : vec3f) -> f32 {
    var df : f32 = dot(normalize(normal), normalize(light_direction));

    return max(0.0, df);
}





@fragment
fn fragment(input : FragmentInput) -> FragmentOutput {
    var output : FragmentOutput;

    // Lambertian and ambient shading
    let N = normalize(input.normal);
    let L = normalize(light.position - input.position);
    let lambert = max(dot(N, L), 0);

    let materialColor = textureSample(baseTexture, baseSampler, input.texcoords) * material.baseFactor;

    let lambertFactor = vec4(vec3(lambert * 1), 1);
    let ambientFactor = vec4(vec3(light.ambient), 1);
    let combinedColor = materialColor * (lambertFactor + ambientFactor);




    // Dot pattern
    let min_resolution = min(custom.u_resolution.x, custom.u_resolution.y);
    //let light2Dposition = vec2(light.position[0],light.position[1]);
    let light_direction = vec3(light.position - input.position / min_resolution);
    
    // Calculate the light diffusion factor
    let df : f32 = diffuseFactor(input.normal, L); //bo treba se dodati FrontFacing
    
    let pos = vec2(input.clipPosition.xy - 0.5 * custom.u_resolution);

    // Rotate the coordinates 20 degrees
    let pos_rotated = rotate(radians(20.0)) * pos; 

    // Define the grid
    let grid_step : f32 = 8;
    let grid_pos = vec2(pos - grid_step * floor(pos / grid_step)); //preglej alternativo za mod()


    var surface_color : f32 = 1.0;
    surface_color -= circle(grid_pos, vec2f(grid_step / 2.0), 0.8 * grid_step * pow(1.0 - df,2.0));
    surface_color = clamp(surface_color, 0.1, 1);

    let dotColor = vec4(vec3(surface_color), 1.0);


    // Determine if the dot pattern is closer to black
    let isDotPatternBlack = dotColor.r < 0.1 && dotColor.g < 0.1 && dotColor.b < 0.1;


    var finalColor = (dotColor + ambientFactor ) * materialColor; // Default to material color

    

    output.color = finalColor;
    

    return output;
}



