import { container } from '@sapphire/framework';
import { methods, Route, type ApiResponse } from '@sapphire/plugin-api';
import { isDateString } from '../../../helpers/utils/date';
import type { ApiRequest, BirthdayQuery } from '../../../lib/api/types';
import { authenticated, validateParams } from '../../../lib/api/utils';
import { APIErrorCode } from '../../../lib/enum/APIErrorCode.enum';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Route.Options>({ route: 'birthday/create' })
export class BirthdayCreateRoute extends Route {
	@authenticated()
	@validateParams<BirthdayQuery>(['guild_id', 'user_id', 'date'])
	public async [methods.POST](request: ApiRequest<BirthdayQuery>, response: ApiResponse) {
		const { date, user_id, guild_id, username = null, discriminator = null } = request.query;

		const isDate = isDateString(date);

		if (!isDate) {
			return response.badRequest({
				success: false,
				error: { code: APIErrorCode.INVALID_DATE_FORMAT, message: 'Wrong Date Format use YYYY-MM-DD or XXXX-MM-DD' },
			});
		}

		await container.prisma.user.create({
			data: {
				user_id: user_id,
				username: username,
				discriminator: discriminator,
				birthday: {
					create: {
						birthday: date,
						guild_id: guild_id,
					},
				},
			},
		});

		return response.created({ success: true });
	}
}
