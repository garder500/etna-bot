import type {
    ApplicationCommand,
    AutocompleteInteraction,
    CommandInteraction,
    Interaction,
    RESTPostAPIApplicationCommandsJSONBody,
    APIApplicationCommand,
    CacheType
} from "discord.js";
import Bot from "@/bot";

type Commande = RESTPostAPIApplicationCommandsJSONBody;
export default abstract class baseCommands {
    name: string;
    client: Bot;
    command: Interaction<CacheType> | ApplicationCommand | APIApplicationCommand | undefined;
    autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
    constructor(client: Bot, data: Commande, guildId?: string) {
        if (!guildId) {
            client.application?.commands
                .create(data)
                .then((cmd) => {
                    console.log(`[command] ${data.name} created`);
                    this.command = cmd;
                })
                .catch((err) => {
                    console.log(`[command] ${data.name} not created`);
                    console.log(err);
                });
        }

        this.name = data.name;
        this.client = client;
    }

    abstract run(interaction: CommandInteraction<CacheType>): Promise<void>;
}