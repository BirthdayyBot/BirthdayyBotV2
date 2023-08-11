import { BirthdayyEmojis, Permission_Bits } from '#lib/utils/environment';
import { container } from '@sapphire/framework';
import { resolveKey, type Target } from '@sapphire/plugin-i18next';
import { ButtonBuilder, ButtonStyle, ComponentType, OAuth2Scopes } from 'discord.js';

export const WebsiteUrl = (path?: string) => `https://birthdayy.xyz/${path ? `${path}` : ''}`;

export const enum ButtonID {
	voteReminder = 'vote-reminder-button',
	choiceBirthdayList = 'choice-birthday-list',
	choiceGuildConfig = 'choice-guild-config',
	choiceDiscordInformation = 'choice-discord-information',
}

export function defaultButtonBuilder(data?: import('discord.js').ButtonComponentData) {
	return new ButtonBuilder({
		style: ButtonStyle.Link,
		type: ComponentType.Button,
		disabled: false,
		...data,
	});
}

export async function inviteSupportDicordButton(target: Target) {
	const label = await resolveKey(target, 'button:supportDiscord');
	return defaultButtonBuilder().setLabel(label).setURL(WebsiteUrl('discord')).setEmoji(BirthdayyEmojis.People);
}

export async function docsButtonBuilder(target: Target) {
	const label = await resolveKey(target, 'button:docsBirthday');
	return defaultButtonBuilder().setLabel(label).setURL(WebsiteUrl('docs')).setEmoji(BirthdayyEmojis.Book);
}

export async function inviteBirthdayyButton(target: Target) {
	const label = await resolveKey(target, 'button:inviteBithdayy');
	console.log(label);
	return defaultButtonBuilder()
		.setLabel(label)
		.setURL(
			container.client.generateInvite({
				scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
				permissions: Permission_Bits,
			}),
		)
		.setEmoji(BirthdayyEmojis.Gift);
}

export async function remindMeButtonBuilder(target: Target) {
	const label = await resolveKey(target, 'button:remindeMe');
	return defaultButtonBuilder().setLabel(label).setCustomId(ButtonID.voteReminder).setEmoji(BirthdayyEmojis.Alarm);
}

export async function remindMeButtonDisabledBuilder(target: Target) {
	return (await remindMeButtonBuilder(target)).setDisabled(true);
}

export async function websiteButtonBuiler(target: Target) {
	const label = await resolveKey(target, 'button:website');
	return defaultButtonBuilder().setLabel(label).setEmoji(BirthdayyEmojis.Link).setURL(WebsiteUrl());
}

export async function birthdayListButtonBuilder(target: Target) {
	const label = await resolveKey(target, 'button:birthdayyList');
	return defaultButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setLabel(label)
		.setEmoji(BirthdayyEmojis.Cake)
		.setCustomId(ButtonID.choiceBirthdayList);
}

export async function guildConfigButtonBuilder(target: Target) {
	const label = await resolveKey(target, 'button:guildConfig');
	return defaultButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setLabel(label)
		.setEmoji(BirthdayyEmojis.Tools)
		.setCustomId(ButtonID.choiceGuildConfig);
}

export async function discordInformationButtonBuilder(target: Target) {
	const label = await resolveKey(target, 'button:discordInfo');
	return defaultButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setLabel(label)
		.setEmoji(BirthdayyEmojis.Support)
		.setCustomId(ButtonID.choiceDiscordInformation);
}
