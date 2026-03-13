fn main() {
    // Embed icon.ico into the Windows exe (works on Linux cross-compilation via windres)
    embed_resource::compile("app.rc", embed_resource::NONE);
    tauri_build::build()
}
