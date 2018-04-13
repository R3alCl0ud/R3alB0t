package xyz.r3alb0t.r3alb0t.music;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;

import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.channel.IGuildVoiceChannel;
import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.voice.VoiceConnection;

public class RBMusic {

	public static Map<Long, PlaylistManager> plManagers = new HashMap<>();
	public static Map<Long, AudioPlaylist> searchResults = new HashMap<>();

	public static CompletableFuture<VoiceConnection> joinVoice(IGuildMember member, IGuildTextChannel boundChannel) {
		CompletableFuture<VoiceConnection> future;
		if (member != null) {
			IGuildVoiceChannel channel = member.getVoiceChannel();
			IGuild guild = member.getGuild();
			if (channel != null) {
				future = channel.join();
				if (!plManagers.containsKey(guild.getID())) {
					future.thenAcceptAsync(vc -> {
						plManagers.put(guild.getID(), new PlaylistManager(vc, boundChannel));
					});
				}
			} else {
				future = new CompletableFuture<>();
				future.completeExceptionally(new RuntimeException("Channel Null"));
			}
		} else {
			future = new CompletableFuture<>();
			future.completeExceptionally(new RuntimeException("Member Null"));
		}
		return future;
	}

}
