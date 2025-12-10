{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREETING = "Discord Bot Development Environment";

  # https://devenv.sh/packages/
  packages = [ 
    pkgs.git
    pkgs.sqlite
  ];

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    bun.enable = true;
  };

  languages.typescript.enable = true;

  # https://devenv.sh/processes/
  processes = {
    bot-dev.exec = "bun run dev";
  };

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.setup.exec = ''
    echo "Setting up Discord bot environment..."
    if [ ! -f .env ]; then
      echo "Creating .env file from .env.example..."
      cp .env.example .env
      echo "⚠️  Please edit .env and add your Discord bot token"
    fi
    echo "Installing dependencies..."
    bun install
    echo "Generating Prisma client..."
    bun run db:generate
    echo "Running database migrations..."
    bun run db:migrate
    echo "✅ Setup complete! Run 'devenv up' to start the bot in dev mode"
  '';

  scripts.verify.exec = ''
    ./verify-setup.sh
  '';

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
  dotenv.enable = true;
}
