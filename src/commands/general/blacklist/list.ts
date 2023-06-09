import { Command, RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { reply } from '../../../helpers/send/response';
import thinking from '../../../lib/discord/thinking';
import { generateDefaultEmbed } from '../../../lib/utils/embed';

@RegisterSubCommand('blacklist', (builder) => builder.setName('list').setDescription('List all blacklisted users'))
export class ListCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction<'cached'>) {
		await thinking(interaction);

		return reply(interaction, {
			embeds: [
				generateDefaultEmbed({
					title: 'Blacklisted Users',
					description: `Blacklisted users:`,
				}),
			],
		});
	}
}
