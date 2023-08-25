import { defaultClientPermissions, defaultUserPermissions } from '#lib/types';
import { interactionSuccess, reply, resolveTarget } from '#utils';
import { Command, RegisterSubCommand } from '@kaname-png/plugin-subcommands-advanced';
import { RequiresClientPermissions, RequiresGuildContext, RequiresUserPermissions } from '@sapphire/decorators';
import { testBirthdaySubCommand } from './birthday.js';

@RegisterSubCommand('birthday', (builder) => testBirthdaySubCommand(builder))
export class TestCommand extends Command {
	@RequiresGuildContext()
	@RequiresClientPermissions(defaultClientPermissions)
	@RequiresUserPermissions(defaultUserPermissions)
	public override async chatInputRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { user } = resolveTarget(interaction);

		await this.container.tasks.run('BirthdayReminderTask', {
			guildId: interaction.guildId,
			isTest: true,
			userId: user.id,
		});

		return reply(interactionSuccess('Birthday Test Run!'));
	}
}
