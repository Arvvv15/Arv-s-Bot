import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks the bot's latency and API speed"),

    async prefixExecute(interaction) {
        try {
            const startTime = Date.now();
            const pingingMessage = await interaction.reply({ content: 'Pinging...' });

            const latency = Date.now() - startTime;
            const apiLatency = Math.max(0, Math.round(interaction.client.ws.ping));

            const embed = createEmbed({ title: 'Pong!', description: null }).addFields(
                { name: 'Bot Latency', value: `${latency}ms`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
            );

            await pingingMessage.edit({ content: null, embeds: [embed] });
        } catch (error) {
            logger.error('Ping prefix command error:', error);
            if (!interaction.replied && !interaction._replyMessage) {
                await interaction.channel.send({
                    embeds: [createEmbed({ title: 'System Error', description: 'Could not determine latency at this time.', color: 'error' })],
                }).catch(() => {});
            }
        }
    },

    async execute(interaction) {
        logger.info('execute called - checking if slash command or prefix command');
        logger.info(`execute - has _commandStartTime: ${!!interaction._commandStartTime}, createdTimestamp: ${interaction.createdTimestamp}`);
        
        const deferSuccess = await InteractionHelper.safeDefer(interaction);
        if (!deferSuccess) {
            logger.warn(`Ping interaction defer failed`, {
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'ping'
            });
            return;
        }

        try {
            const start = performance.now();

const apiLatency = Math.max(0, Math.round(interaction.client.ws.ping));
const processingTime = Math.round(performance.now() - start);

const uptime = interaction.client.uptime;

const days = Math.floor(uptime / 86400000);
const hours = Math.floor((uptime % 86400000) / 3600000);
const minutes = Math.floor((uptime % 3600000) / 60000);

const uptimeString =
    days > 0
        ? `${days}d ${hours}h ${minutes}m`
        : `${hours}h ${minutes}m`;

logger.info(`Ping | Processing: ${processingTime}ms | API: ${apiLatency}ms`);

            const embed = createEmbed({
    title: "🏓 Pong!"
}).addFields(
    {
        name: "⚡ Processing",
        value: `\`${processingTime}ms\``,
        inline: true
    },
    {
        name: "🌐 API",
        value: `\`${apiLatency}ms\``,
        inline: true
    },
    {
        name: "🖥️ Uptime",
        value: `\`${uptimeString}\``,
        inline: true
    }
);

            await InteractionHelper.safeEditReply(interaction, {
                content: null,
                embeds: [embed],
            });
        } catch (error) {
            logger.error('Ping command error:', error);
            try {
                return await InteractionHelper.safeReply(interaction, {
                    embeds: [createEmbed({ title: 'System Error', description: 'Could not determine latency at this time.', color: 'error' })],
                    flags: MessageFlags.Ephemeral,
                });
            } catch (replyError) {
                logger.error('Failed to send error reply:', replyError);
            }
        }
    },
};
