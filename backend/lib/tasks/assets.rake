# Empty assets:precompile task for Render.com
# Rails 7 with Vite doesn't use traditional asset pipeline
namespace :assets do
  desc "Precompile assets (no-op for Vite)"
  task :precompile do
    puts "Skipping assets:precompile (using Vite for asset management)"
  end
end
