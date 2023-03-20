import { container } from '@sapphire/framework';
import { methods, Route, type ApiResponse } from '@sapphire/plugin-api';
import type { ApiRequest, GuildQuery } from '../../../lib/api/types';
import { authenticated, validateParams } from '../../../lib/api/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { selectGuildPremium, updateGuildsNotInAndBirthdays } from '../../../lib/db';

@ApplyOptions<Route.Options>({ route: 'guild/leave' })
export class UserRoute extends Route {
	@authenticated()
	@validateParams<GuildQuery>()
	public async [methods.POST](request: ApiRequest<GuildQuery>, response: ApiResponse) {
		const { query } = request;
		const { guild_id } = query;

		const guild = await container.prisma.guild.update({
			...updateGuildsNotInAndBirthdays(guild_id, true),
			...selectGuildPremium,
		});

		if (!guild) {
			return response.status(404).json({ error: 'Guild not found' });
		}

		return response.ok({ message: `Guild ${guild_id} left`, guild });
	}
}
