import { ApplyOptions } from '@sapphire/decorators';
import { ChatInputCommandSuccessPayload, container, Events, Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { logSuccessCommand } from '../../../helpers/utils/utils';

@ApplyOptions<Listener.Options>({
	event: Events.ChatInputCommandSuccess,
	enabled: (container.logger as Logger).level <= LogLevel.Debug,
})
export class UserListener extends Listener {
	public run(payload: ChatInputCommandSuccessPayload) {
		return logSuccessCommand(payload);
	}
}
