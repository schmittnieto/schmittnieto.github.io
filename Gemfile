source "https://rubygems.org"

# Pinned on purpose. Unpinned, Bundler can resolve to github-pages 222, which
# pins liquid 4.0.3. That version calls Object#tainted?, removed in Ruby 3.2,
# so every {% assign %} raises NoMethodError on the local Ruby 3.3.
# github-pages 232 ships Jekyll 3.10.0 with liquid 4.0.4, which is Ruby 3.2+ safe.
gem "github-pages", "~> 232", group: :jekyll_plugins

gem "tzinfo-data"
gem "wdm", "~> 0.2.0" if Gem.win_platform?

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-feed"
  gem "jemoji"
  gem "jekyll-include-cache"
  gem "jekyll-algolia"
  gem 'webrick'
end
