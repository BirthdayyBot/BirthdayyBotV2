import { CustomCommand } from '#lib/structures/commands/CustomCommand';
import { Events as BirthdayyEvents } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, type ChatInputCommandSuccessPayload } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ event: Events.ChatInputCommandSuccess })
export class UserListener extends Listener<typeof Events.ChatInputCommandSuccess> {
	public run(payload: ChatInputCommandSuccessPayload) {
		const command = payload.command as CustomCommand;
		this.container.client.emit(BirthdayyEvents.CommandUsageAnalytics, command.name, command.category);
	}
}
