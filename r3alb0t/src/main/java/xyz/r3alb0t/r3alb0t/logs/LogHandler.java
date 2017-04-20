package xyz.r3alb0t.r3alb0t.logs;

import java.io.IOException;
import java.time.OffsetDateTime;

import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.guild.member.GuildMemberEvent.VoiceJoinEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberEvent.VoiceLeaveEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberEvent.VoiceSwitchEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberRemoveEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberUpdateEvent;
import io.discloader.discloader.common.event.message.MessageDeleteEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.IGuildVoiceChannel;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.message.IMessage;

public class LogHandler extends EventListenerAdapter {

	private Resource vswitch = new Resource("r3alb0t", "texture/icon/logs/voiceSwitch.png");
	private Resource vjoin = new Resource("r3alb0t", "texture/icon/logs/voiceJoin.png");
	private Resource vleave = new Resource("r3alb0t", "texture/icon/logs/voiceLeave.png");

	@Override
	public void GuildMemberRemove(GuildMemberRemoveEvent event) {
		// IGuildMember member = event.getMember();
		// ITextChannel testChannel =
		// EntityRegistry.getTextChannelByID(282230026869669888L);
		// RichEmbed embed = new
		// RichEmbed(member.toString()).setDescription("Left the
		// guild").setColor(0xf10000).setThumbnail(Endpoints.avatar(member.getID(),
		// member.getUser().getAvatar().toString()));
		// embed.setTimestamp(OffsetDateTime.now());
		// testChannel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberUpdate(GuildMemberUpdateEvent event) {
		if (event.guild.getID() != 282226852616077312l) return;
		IGuild guild = event.guild;
		IGuildMember member = event.member, oldMember = event.oldMember;
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		RichEmbed embed = new RichEmbed().setAuthor(String.format("%s (ID: %d)", member.toString(), member.getID()), "", member.getUser().getAvatar().toString()).setTimestamp(OffsetDateTime.now());
		if (!member.getNickname().equals(oldMember.getNickname())) {
			embed.setColor(0xfefa2a).setTitle("Nickname changed");
			embed.addField("Old Nickname", oldMember.getNickname(), true).addField("New Nickname", member.getNickname(), true);
		} else if (member.getVoiceChannel() == null && oldMember.getVoiceChannel() != null) {
			embed.setTitle("Joined a voice channel").addField("Voice Channel", String.format("**%s** (ID: %d)", member.getVoiceChannel().getName(), member.getVoiceChannel().getID())).setColor(0x00fa00);
		} else if (member.getVoiceChannel() != null && oldMember.getVoiceChannel() == null) {
			embed.setTitle("Left a voice channel").addField("Voice Channel", String.format("**%s** (ID: %d)", oldMember.getVoiceChannel().getName(), oldMember.getVoiceChannel().getID())).setColor(0xfa2222);
		} else if (member.getVoiceChannel() != null && oldMember.getVoiceChannel() != null) {
			embed.setTitle("Switched Voice Channels").addField("Old Channel", String.format("**%s** (ID: %d)", member.getVoiceChannel().getName(), member.getVoiceChannel().getID()), true)
					.addField("New Channel", String.format("**%s** (ID: %d)", oldMember.getVoiceChannel().getName(), oldMember.getVoiceChannel().getID()), true).setColor(0xfafa22);
		}
		// System.out.println(DLUtil.gson.toJson(embed));

		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberVoiceJoin(VoiceJoinEvent event) {
		System.out.println("does this ever get here?");
		if (event.getGuild().getID() != 282226852616077312l) return;
		IGuild guild = event.getGuild();
		IGuildMember member = event.getMember();
		IGuildVoiceChannel voiceChannel = event.getChannel();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		RichEmbed embed = new RichEmbed("Joined a Voice Channel").setTimestamp(OffsetDateTime.now()).setColor(0x00fa00);
		embed.addField("Member", String.format("**%s** (ID: %d)", member.getNickname(), member.getID()));
		embed.addField("Voice Channel", String.format("**%s** (ID: %d)", voiceChannel.getName(), voiceChannel.getID()), true);
		try {
			embed.setThumbnail(vjoin.getFile());
		} catch (IOException e) {
			// e.printStackTrace();
		}
		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberVoiceLeave(VoiceLeaveEvent event) {
		if (event.getGuild().getID() != 282226852616077312l) return;
		IGuild guild = event.getGuild();
		IGuildMember member = event.getMember();
		IGuildVoiceChannel voiceChannel = event.getVoiceChannel();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		RichEmbed embed = new RichEmbed("Left Voice Channel").setTimestamp(OffsetDateTime.now()).setColor(0xa93d3d);
		embed.addField("Member", String.format("**%s** (ID: %d)", member.getNickname(), member.getID()));
		embed.addField("Voice Channel", String.format("**%s** (ID: %d)", voiceChannel.getName(), voiceChannel.getID()), true);
		try {
			embed.setThumbnail(vleave.getFile());
		} catch (IOException e) {
			// e.printStackTrace();
		}
		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberVoiceSwitch(VoiceSwitchEvent event) {
		if (event.getGuild().getID() != 282226852616077312l) return;
		IGuild guild = event.getGuild();
		IGuildMember member = event.getMember();
		IGuildVoiceChannel voiceChannel = event.getVoiceChannel(), oldVoiceChannel = event.getOldVoiceChannel();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		RichEmbed embed = new RichEmbed("Switched Voice Channels").setTimestamp(OffsetDateTime.now()).setColor(0xff7000);
		embed.addField("Member", String.format("**%s** (ID: %d)", member.getNickname(), member.getID()));
		embed.addField("Previous Voice Channel", String.format("**%s** (ID: %d)", oldVoiceChannel.getName(), oldVoiceChannel.getID()), true);
		embed.addField("Current Voice Channel", String.format("**%s** (ID: %d)", voiceChannel.getName(), voiceChannel.getID()), true);
		try {
			embed.setThumbnail(vswitch.getFile());
		} catch (IOException e) {
		}
		channel.sendEmbed(embed);
	}

	// @Override
	// public void MessageDelete(MessageDeleteEvent event) {
	// System.out.println("test");
	// }

	@Override
	public void MessageDelete(MessageDeleteEvent event) {
		IMessage message = event.getMessage();
		IGuild guild = message.getGuild();
		if (guild == null || guild.getID() != 282226852616077312l) return;
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		RichEmbed embed = new RichEmbed("Message Deleted").setTimestamp(OffsetDateTime.now());
		System.out.println("" + message.getContent());
		embed.addField("Channel", event.getChannel().toMention(), true);
		embed.addField("Author", String.format("%s (ID: %d)", message.getAuthor().asMention(), message.getAuthor().getID()), true);
		embed.addField("Message Contents", message.getContent(), true);
		channel.sendEmbed(embed);
	}
}
