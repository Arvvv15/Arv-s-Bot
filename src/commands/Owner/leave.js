import { SlashCommandBuilder, MessageFlags } from "discord.js";
import { createEmbed } from "../../utils/embeds.js";
import { InteractionHelper } from "../../utils/interactionHelper.js";
import { logger } from "../../utils/logger.js";
import { isBotOwner } from "../../config/bot.js";

export default {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Make the bot leave a server (Bot Owner Only)")
        .addStringOption(option =>
            option
                .setName("server_id")
                .setDescription("The ID of the server to leave")
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!isBotOwner(interaction.user.id)) {
            return InteractionHelper.safeReply(interaction, {
                embeds: [
                    createEmbed({
                        title: "Access Denied",
                        description: "Only the bot owner can use this command.",
                        color: "error",
                    }),
                ],
                flags: MessageFlags.Ephemeral,
            });
        }

        const deferSuccess = await InteractionHelper.safeDefer(interaction);
        if (!deferSuccess) return;

        try {
            const serverId = interaction.options.getString("server_id");
            const guild = interaction.client.guilds.cache.get(serverId);

            if (!guild) {
                return InteractionHelper.safeEditReply(interaction, {
                    embeds: [
                        createEmbed({
                            title: "Server Not Found",
                            description: "I'm not in that server.",
                            color: "error",
                        }),
                    ],
                });
            }

            const guildName = guild.name;

            await guild.leave();

            return InteractionHelper.safeEditReply(interaction, {
                embeds: [
                    createEmbed({
                        title: "Success",
                        description: `Successfully left **${guildName}**.`,
                        color: "success",
                    }),
                ],
            });

        } catch (error) {
            logger.error("Leave command error:", error);

            return InteractionHelper.safeEditReply(interaction, {
                embeds: [
                    createEmbed({
                        title: "Error",
                        description: "Failed to leave the server.",
                        color: "error",
                    }),
                ],
            });
        }
    },
};
