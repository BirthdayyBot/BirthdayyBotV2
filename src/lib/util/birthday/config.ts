import { DefaultEmbedBuilder } from '#lib/discord';
import { formatBirthdayMessage } from '#utils/common/string';
import { Emojis } from '#utils/constants';
import type { Guild as PrismaGuild } from '@prisma/client';
import { container } from '@sapphire/framework';
import { objectEntries } from '@sapphire/utilities';
import {
	channelMention,
	EmbedBuilder,
	roleMention,
	userMention,
	type APIEmbedField,
	type Guild,
	type GuildMember,
	type Snowflake
} from 'discord.js';

interface ConfigListOptions {
	member: GuildMember;
	guild?: Guild;
}

export default async function generateConfigListToApiEmbed(
	guildId: Snowflake,
	options: ConfigListOptions
): Promise<EmbedBuilder> {
	const embedFields = await generateFields(guildId, options.member);
	const guildInfo: Guild | null = options.guild ? options.guild : await container.client.guilds.fetch(guildId);
	if (!guildInfo) {
		return new EmbedBuilder()
			.setTitle('Config List')
			.setDescription('An error occurred while fetching the guild information.');
	}

	return new DefaultEmbedBuilder()
		.setTitle(`Config List - ${guildInfo.name}`)
		.setDescription('Use /config `<setting>` `<value>` to change any setting')
		.addFields(embedFields);
}
async function generateFields(guildId: string, member: GuildMember): Promise<APIEmbedField[]> {
	const config = await container.prisma.guild.upsert({
		create: { guildId },
		where: { guildId },
		update: { guildId },
		select: {
			birthdayRole: true,
			birthdayPingRole: true,
			announcementChannel: true,
			announcementMessage: true,
			overviewChannel: true,
			timezone: true,
			language: true,
			premium: true
		}
	});

	return objectEntries(config).map(([name, value]) => {
		const valueString = getValueString(name, value, member);
		const nameString = getNameString(name);
		return {
			name: nameString,
			value: valueString,
			inline: false
		};
	});

	function getValueString(name: keyof PrismaGuild, value: string | number | boolean | null, member: GuildMember) {
		if (value === null) {
			return `${Emojis.ArrowRight} not set`;
		} else if (name === 'timezone' && typeof value === 'number') {
			return value < 0 ? `${Emojis.ArrowRight} UTC${value}` : `${Emojis.ArrowRight} UTC+${value}`;
		} else if (name.includes('Channel') && typeof value === 'string') {
			return `${Emojis.ArrowRight} ${channelMention(value)}`;
		} else if (name.includes('Role') && typeof value === 'string') {
			return `${Emojis.ArrowRight} ${roleMention(value)}`;
		} else if (name.includes('User') && typeof value === 'string') {
			return `${Emojis.ArrowRight} ${userMention(value)}`;
		} else if (name === 'announcementMessage' && typeof value === 'string') {
			return `${Emojis.ArrowRight} ${formatBirthdayMessage(value, member)}`;
		}
		return `${Emojis.ArrowRight} ${value.toString()}`;
	}

	function getNameString(name: keyof PrismaGuild): string {
		switch (name) {
			case 'announcementChannel':
				return 'Announcement Channel';
			case 'overviewChannel':
				return 'Overview Channel';
			case 'birthdayRole':
				return 'Birthday Role';
			case 'birthdayPingRole':
				return 'Birthday Ping Role';
			case 'logChannel':
				return 'Log Channel';
			case 'timezone':
				return 'Timezone';
			case 'announcementMessage':
				return `${Emojis.Plus} Birthday Message`;
			case 'premium':
				return 'Premium';
			default:
				return name;
		}
	}
}
