package xyz.r3alb0t.r3alb0t.logs;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import javax.imageio.ImageIO;
import javax.swing.ImageIcon;

import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.guild.member.GuildMemberAddEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberEvent.VoiceJoinEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberEvent.VoiceLeaveEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberEvent.VoiceSwitchEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberRemoveEvent;
import io.discloader.discloader.common.event.guild.member.GuildMemberUpdateEvent;
import io.discloader.discloader.common.event.message.MessageDeleteEvent;
import io.discloader.discloader.common.event.message.MessageUpdateEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.entity.channel.IGuildVoiceChannel;
import io.discloader.discloader.entity.channel.ITextChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.message.IMessage;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.util.DLUtil;

public class LogHandler extends EventListenerAdapter {

	private Resource vswitch = new Resource("r3alb0t", "texture/icon/logs/voiceSwitch.png");
	private Resource vjoin = new Resource("r3alb0t", "texture/icon/logs/voiceJoin.png");
	private Resource vleave = new Resource("r3alb0t", "texture/icon/logs/voiceLeave.png");
	private Resource mdelete = new Resource("r3alb0t", "texture/icon/logs/messageDelete.png");
	private Resource medit = new Resource("r3alb0t", "texture/icon/logs/messageEdit.png");
	private Resource nameChange = new Resource("r3alb0t", "texture/icon/logs/nameChange.png");
	private Resource sjoin = new Resource("r3alb0t", "texture/icon/logs/joinServer.png");
	private Resource sleave = new Resource("r3alb0t", "texture/icon/logs/leaveServer.png");

	public static Map<Long, GuildStruct> enabledGuilds = new HashMap<>();

	public static void load() {
		//
		// System.out.println(jedis.dbSize());
		// Transaction t = jedis.multi();
		// t.smembers("Commands.282226852616077312");
		// List<Object> res = t.exec();
		// for (Object obj : res) {
		// System.out.println(obj);
		// }
		// jedis.a
	}

	public static void save() {
		String json = DLUtil.gson.toJson(enabledGuilds.values().toArray(new GuildStruct[0]));
	}

	// @Override
	// public void GuildBanAdd(GuildBanAddEvent event) {
	// IGuild guild = event.getGuild();
	// if (guild.getID() != 282226852616077312l && guild.getID() !=
	// 201544496654057472l)
	// return;
	// IUser user = event.getBannedUser();
	// ITextChannel channel = guild.getTextChannelByName("serverlog");
	// RichEmbed embed = new RichEmbed("User
	// Banned").setColor(0xff2020).setTimestamp(OffsetDateTime.now());
	// embed.addField("Banned User", String.format("%s (ID: %d)",
	// user.asMention(), user.getID()));
	// channel.sendEmbed(embed);
	// }

	@Override
	public void GuildMemberAdd(GuildMemberAddEvent event) {
		IGuild guild = event.getGuild();
		if (guild.getID() != 282226852616077312l && guild.getID() != 201544496654057472l) return;
		IGuildMember member = event.getMember();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		RichEmbed embed = new RichEmbed("Member Joined").setColor(0x2edbe6).setTimestamp(OffsetDateTime.now());
		embed.addField("Member", formatMember(member));
		embed.setThumbnail(sjoin);
		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberRemove(GuildMemberRemoveEvent event) {
		IGuild guild = event.getGuild();
		if (guild.getID() != 282226852616077312l && guild.getID() != 201544496654057472l) return;
		IGuildMember member = event.getMember();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		RichEmbed embed = new RichEmbed("Member Left").setColor(0xf10000).setTimestamp(OffsetDateTime.now());
		embed.setDescription("A member has **left** or has been **kicked** from the guild");
		embed.addField("Member", formatMember(member));
		embed.setThumbnail(sleave);
		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberUpdate(GuildMemberUpdateEvent event) {
		if (event.guild.getID() != 282226852616077312l && event.guild.getID() != 201544496654057472l) return;
		IGuild guild = event.guild;
		IGuildMember member = event.member, oldMember = event.oldMember;
		IUser user = member.getUser(), oldUser = oldMember.getUser();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		if (channel == null) return;
		RichEmbed embed = new RichEmbed().setTimestamp(OffsetDateTime.now());
		embed.addField("Member", formatMember(member));
		if (!member.getNickname().equals(oldMember.getNickname())) {
			embed.setColor(0xfefa2a).setTitle("Nickname changed");
			embed.addField("Old Nickname", oldMember.getNickname(), true).addField("New Nickname", member.getNickname(), true);
			try {
				BufferedImage bi = new BufferedImage(256, 256, BufferedImage.TYPE_INT_ARGB);
				Graphics bg = bi.getGraphics();
				bg.drawImage(new ImageIcon(nameChange.toURL()).getImage(), 0, 0, null);
				bg.setColor(Color.BLACK);
				bg.setFont(new Font(".Nadeem PUA", Font.PLAIN, 28));
				FontMetrics fm = bg.getFontMetrics();
				List<String> lines = wrapText(member.getNickname(), fm, 210);
				for (int i = 0; i < lines.size(); i++)
					bg.drawString(lines.get(i), 30, 164 + (32 * i));
				File temp = File.createTempFile("" + member.getID(), ".png");
				bg.dispose();
				ImageIO.write(bi, "png", temp);
				embed.setThumbnail(temp);
				channel.sendEmbed(embed).thenAccept(action -> {
					temp.delete();
				});
				return;
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else if (!user.getUsername().equals(oldUser.getUsername())) {
			embed.setColor(0xfefa2a).setTitle("Username changed");
			embed.addField("Old Username", oldMember.getUser().getUsername(), true).addField("New Username", member.getUser().getUsername(), true);
		} else if ((user != null && oldUser != null) && (user.getAvatar() != null && oldUser.getAvatar() != null)) {
			if (user.getAvatar().toString() != null && oldUser.getAvatar().toString() != null && !user.getAvatar().toString().equals(oldUser.getAvatar().toString())) {
				try {
					embed.setColor(0xfefa2a).setTitle("Avatar changed");
					BufferedImage bi = new BufferedImage(256, 128, BufferedImage.TYPE_INT_RGB);
					Graphics bg = bi.getGraphics();
					bg.drawImage(new ImageIcon(oldUser.getAvatar().toURL()).getImage(), 0, 0, null);
					bg.drawImage(new ImageIcon(user.getAvatar().toURL()).getImage(), 128, 0, null);
					bg.dispose();
					File temp = File.createTempFile(user.toString(), ".png");
					ImageIO.write(bi, "png", temp);
					embed.setImage(temp);
				} catch (IOException e) {
					e.printStackTrace();
				}
			} else {
				return;
			}
		} else {
			return;
		}
		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberVoiceJoin(VoiceJoinEvent event) {

		if (event.getGuild().getID() != 282226852616077312l && event.getGuild().getID() != 201544496654057472l) return;
		IGuild guild = event.getGuild();
		IGuildMember member = event.getMember();
		IGuildVoiceChannel voiceChannel = event.getChannel();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		if (channel == null) return;
		RichEmbed embed = new RichEmbed("Joined a Voice Channel").setTimestamp(OffsetDateTime.now()).setColor(0x00fa00);
		embed.addField("Member", String.format("**%s** (ID: %d)", member.getNickname(), member.getID()));
		embed.addField("Voice Channel", String.format("**%s** (ID: %d)", voiceChannel.getName(), voiceChannel.getID()), true);
		embed.setThumbnail(vjoin);
		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberVoiceLeave(VoiceLeaveEvent event) {
		if (event.getGuild().getID() != 282226852616077312l && event.getGuild().getID() != 201544496654057472l) return;
		IGuild guild = event.getGuild();
		IGuildMember member = event.getMember();
		IGuildVoiceChannel voiceChannel = event.getVoiceChannel();
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		if (channel == null) return;
		RichEmbed embed = new RichEmbed("Left Voice Channel").setTimestamp(OffsetDateTime.now()).setColor(0xa93d3d);
		embed.addField("Member", String.format("**%s** (ID: %d)", member.getNickname(), member.getID()));
		embed.addField("Voice Channel", String.format("**%s** (ID: %d)", voiceChannel.getName(), voiceChannel.getID()), true);
		embed.setThumbnail(vleave);
		channel.sendEmbed(embed);
	}

	@Override
	public void GuildMemberVoiceSwitch(VoiceSwitchEvent event) {
		if (event.getGuild().getID() != 282226852616077312l && event.getGuild().getID() != 201544496654057472l) return;
		IGuild guild = event.getGuild();
		IGuildMember member = event.getMember();
		IGuildVoiceChannel voiceChannel = event.getVoiceChannel(), oldVoiceChannel = event.getOldVoiceChannel();
		if (voiceChannel.getID() == oldVoiceChannel.getID()) return;
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		if (channel == null) return;
		RichEmbed embed = new RichEmbed("Switched Voice Channels").setTimestamp(OffsetDateTime.now()).setColor(0xff7000);
		embed.addField("Member", String.format("**%s** (ID: %d)", member.getNickname(), member.getID()));
		embed.addField("Previous Voice Channel", String.format("**%s** (ID: %d)", oldVoiceChannel.getName(), oldVoiceChannel.getID()), true);
		embed.addField("Current Voice Channel", String.format("**%s** (ID: %d)", voiceChannel.getName(), voiceChannel.getID()), true);
		embed.setThumbnail(vswitch);
		channel.sendEmbed(embed);
	}

	@Override
	public void MessageUpdate(MessageUpdateEvent event) {
		IMessage message = event.getMessage(), oldMessage = event.getOldMessage();
		IGuild guild = message.getGuild();
		if (guild == null || guild.getID() != 282226852616077312l && guild.getID() != 201544496654057472l) return;
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		if (channel == null) return;
		RichEmbed embed = new RichEmbed("Message Edited").setColor(0xfcf45a).setTimestamp(OffsetDateTime.now());
		embed.addField("Author", String.format("%s (ID: %d)", message.getAuthor().asMention(), message.getAuthor().getID()));
		if (oldMessage != null) {
			if (oldMessage.getContent().length() > 1000) {
				embed.addField("Old Content", oldMessage.getContent().substring(0, oldMessage.getContent().length() / 2), true);
				embed.addField("\u200b", oldMessage.getContent().substring(oldMessage.getContent().length() / 2), true);
			} else {
				embed.addField("Old Content", event.getOldMessage().getContent(), true);
			}
		}
		if (message.getContent() != null && message.getContent().length() > 1000) {
			embed.addField("New Content", message.getContent().substring(0, message.getContent().length() / 2), true);
			embed.addField("\u200b", message.getContent().substring(message.getContent().length() / 2), true);
		} else {
			embed.addField("New Content", message.getContent(), true);
		}
		embed.setThumbnail(medit);
		channel.sendEmbed(embed);
	}

	@Override
	public void MessageDelete(MessageDeleteEvent event) {
		IMessage message = event.getMessage();
		IGuild guild = message.getGuild();
		if (guild == null || guild.getID() != 282226852616077312l && guild.getID() != 201544496654057472l) return;
		ITextChannel channel = guild.getTextChannelByName("serverlog");
		if (channel == null) return;
		RichEmbed embed = new RichEmbed("Message Deleted").setTimestamp(OffsetDateTime.now()).setColor(0xff2020);
		embed.addField("Channel", event.getChannel().toMention(), true);
		embed.addField("Author", String.format("%s (ID: %d)", message.getAuthor().asMention(), message.getAuthor().getID()), true);
		if (message.getContent().length() > 1000) {
			embed.addField("Message Contents", message.getContent().substring(0, message.getContent().length() / 2), true);
			embed.addField("\u200b", message.getContent().substring(message.getContent().length() / 2), true);
		} else {
			embed.addField("Message Contents", message.getContent(), true);
		}
		embed.setThumbnail(mdelete);
		channel.sendEmbed(embed);
	}

	public static String formatMember(IGuildMember member) {
		return String.format("**%s** (ID: %d)", member.getNickname(), member.getID());
	}

	public static List<String> wrapText(String txt, FontMetrics fm, int maxWidth) {
		StringTokenizer st = new StringTokenizer(txt);

		List<String> list = new ArrayList<>();
		String line = "";
		String lineBeforeAppend = "";
		while (st.hasMoreTokens()) {
			String seg = st.nextToken();
			lineBeforeAppend = line;
			line += seg + " ";
			int width = fm.stringWidth(line);
			if (width < maxWidth) {
				continue;
			} else { // new Line.
				list.add(lineBeforeAppend);
				line = seg + " ";
			}
		}
		// the remaining part.
		if (line.length() > 0) {
			list.add(line);
		}
		return list;
	}
}
