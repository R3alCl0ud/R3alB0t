package xyz.r3alb0t.r3alb0t.music;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackInfo;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackState;

import io.discloader.discloader.client.logger.DLLogger;
import io.discloader.discloader.client.render.util.Resource;
import io.discloader.discloader.common.event.EventListenerAdapter;
import io.discloader.discloader.common.event.message.MessageReactionAddEvent;
import io.discloader.discloader.core.entity.RichEmbed;
import io.discloader.discloader.core.entity.user.DLUser;
import io.discloader.discloader.entity.IEmoji;
import io.discloader.discloader.entity.channel.IGuildTextChannel;
import io.discloader.discloader.entity.channel.IGuildVoiceChannel;
import io.discloader.discloader.entity.guild.IGuildMember;
import io.discloader.discloader.entity.message.IMessage;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.entity.util.Permissions;
import io.discloader.discloader.entity.voice.VoiceConnection;
import io.discloader.discloader.entity.voice.VoiceEventAdapter;

public class PlaylistManager extends VoiceEventAdapter implements AudioLoadResultHandler {

	private VoiceConnection connection;
	// private IGuildVoiceChannel channel;
	private IGuildTextChannel boundChannel;
	private IMessage nowplaying;

	private List<AudioTrack> tracks;

	private int volume = 0;

	private long position = 0l;

	private Resource playing = new Resource("r3alb0t", "texture/command/Play.png");
	private Resource pause = new Resource("r3alb0t", "texture/command/Pause.png");

	public static final Logger logger = new DLLogger(PlaylistManager.class).getLogger();

	String emo = "🔁 🔂";

	private boolean useReactions = false;

	public PlaylistManager(VoiceConnection connection, IGuildTextChannel boundChannel) {
		this.connection = connection;
		this.boundChannel = boundChannel;
		nowplaying = null;
		tracks = new ArrayList<>();
		connection.addListener(this);
		if (useReactions) {
			connection.getLoader().addEventListener(new EventListenerAdapter() {

				public void MessageReactionAdd(MessageReactionAddEvent e) {
					if (nowplaying == null || e.getMessage().getID() != nowplaying.getID() || e.getUser().isBot())
						return;
					IGuildMember member = boundChannel.getGuild().getMember(e.getUser().getID());
					IEmoji emoji = e.getReaction().getEmoji();
					switch (emoji.toString()) {
					case "⏸":
						if (getVoiceChannel().permissionsOf(member).hasPermission(Permissions.MUTE_MEMBERS)) {
							pause();
						}
						break;
					case "🔀":
						shuffle();
						e.getReaction().removeUserReaction(e.getUser());
						sendEmbed();
						break;
					case "⏭":
						if (getVoiceChannel().permissionsOf(member).hasPermission(Permissions.MUTE_MEMBERS) && tracks.size() >= 2)
							connection.play(tracks.get(1));
						break;
					case "🔄":
						e.getReaction().removeUserReaction(e.getUser());
						sendEmbed();
						break;
					case "▶":
						if (getVoiceChannel().permissionsOf(member).hasPermission(Permissions.MUTE_MEMBERS))
							startNext();
						break;
					case "🔇":
						if (getVoiceChannel().permissionsOf(member).hasPermission(Permissions.MUTE_MEMBERS)) {
							volume = connection.getVolume();
							connection.setVolume(0);
						}
						e.getReaction().removeUserReaction(e.getUser());
						sendEmbed();
						break;
					case "🔊":
						int nv = connection.getVolume() + 5;
						if (connection.getVolume() == 0) {
							connection.setVolume(volume == 0 ? nv : volume);
						} else if (nv < 100) {
							connection.setVolume(nv);
						} else {
							connection.setVolume(nv);
							e.getReaction().removeReaction();
						}
						e.getReaction().removeUserReaction(e.getUser());
						if (nowplaying.getReaction("🔉") == null && nv > 0)
							nowplaying.addReaction("🔉");
						sendEmbed();
						break;
					case "🔉":
						int nv1 = connection.getVolume() - 5;
						if (connection.getVolume() == 0) {
							connection.setVolume(volume == 0 ? nv1 : volume);
						} else if (nv1 > 0) {
							connection.setVolume(nv1);
						} else if (getVoiceChannel().permissionsOf(member).hasPermission(Permissions.MUTE_MEMBERS)) {
							connection.setVolume(nv1);
							e.getReaction().removeReaction();
						}
						e.getReaction().removeUserReaction(e.getUser());
						if (nowplaying.getReaction("🔊") == null && nv1 < 100)
							nowplaying.addReaction("🔊");
						sendEmbed();
						break;
					case "⏏":
						if (getVoiceChannel().permissionsOf(member).hasPermission(Permissions.MOVE_MEMBERS, Permissions.CONNECT)) {
							connection.disconnect().thenAccept(a -> {
								if (nowplaying != null) {
									nowplaying.delete();
								}
								connection.getLoader().removeEventListener(this);
							});
						}
						break;
					default:
						break;
					}
				}
			});
		}

	}

	@Override
	public void end(AudioTrack track, AudioTrackEndReason endReason) {
		if (!connection.isPaused())
			tracks.remove(track);
		if (endReason == AudioTrackEndReason.LOAD_FAILED) {
			boundChannel.sendMessage("Failed to load track");
		}
		if (endReason.mayStartNext)
			startNext();
	}

	public IGuildVoiceChannel getVoiceChannel() {
		return (IGuildVoiceChannel) connection.getChannel();
	}

	public long getLength() {
		long l = 0;
		for (AudioTrack track : tracks) {
			l += (track.getDuration() / 1000l);
		}
		return l;
	}

	public AudioTrack getPlayingTrack() {
		return connection.getPlayingTrack();
	}

	public String getTime() {
		return getTime(connection.getPlayingTrack());
	}

	public String getTime(AudioTrack track) {
		if (track == null)
			return "0:00/0:00";
		long l = track.getDuration() / 1000l;
		long s = l % 60l;
		long m = l / 60l;
		long c = track.getPosition() / 1000l, cs = c % 60l, cm = c / 60l;
		return String.format("%d:%02d/%d:%02d", cm, cs, m, s);
	}

	public String getLength(AudioTrack track) {
		long l = track.getDuration() / 1000l, m = l / 60l, s = l % 60l;
		return String.format("%d:%02d", m, s);
	}

	public List<AudioTrack> getTracks() {
		return tracks;
	}

	@Override
	public void loadFailed(FriendlyException e) {
		e.printStackTrace();
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
	}

	public void loadTrack(String id) {
		connection.findTrackOrTracks(id, this);
	}

	@Override
	public void noMatches() {
		boundChannel.sendMessage("Unable to add requested track(s) to the playlist");
	}

	public void pause() {
		position = connection.getPlayingTrack().getPosition();
		connection.pause();
	}

	public void paused(AudioTrack track) {
		AudioTrackInfo info = connection.getPlayingTrack().getInfo();
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
		embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
		embed.addField("Paused", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
		embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
		embed.addField("Current Time", getTime(), true);
		if (tracks.size() > 1 && tracks.get(1) != null) {
			AudioTrackInfo next = tracks.get(1).getInfo();
			embed.addField("Up Next", String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
		}
		embed.setThumbnail(pause);
		if (nowplaying != null)
			nowplaying.delete();
		boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
			nowplaying = msg;
			nowplaying.addReaction("▶").thenAccept(a -> {
				nowplaying.addReaction("🔀").thenAccept(b -> {
					nowplaying.addReaction("🔄").thenAccept(c -> {
						if (tracks.size() > 1 && tracks.get(1) != null)
							nowplaying.addReaction("⏭");
					});
				});
			});
		});
	}

	@Override
	public void playlistLoaded(AudioPlaylist tracks) {
		RichEmbed embed = new RichEmbed("Music PLayer").setColor(0x2566C7);
		DLUser user = connection.getLoader().user;
		embed.setAuthor(user.getUsername(), "http://discloader.io", user.getAvatar().toString());
		embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
		int i = 1;
		for (AudioTrack track : tracks.getTracks())
			this.tracks.add(track);
		for (AudioTrack track : tracks.getTracks()) {
			if (embed.getFields().size() == 5) {
				embed.addField("Total Tracks added", String.format("Added *%d* tracks", tracks.getTracks().size()));
				break;
			}
			AudioTrackInfo info = track.getInfo();
			String name = String.format("%s - %d", tracks.getName(), i);
			String t = String.format("[*%s*](%s)  by %s", info.title, info.uri, info.author);
			embed.addField(name, t);
			i++;
		}
		boundChannel.sendEmbed(embed);
		startNext();
	}

	@Override
	public void resumed(AudioTrack track) {
		started(track);
	}

	public void shuffle() {
		if (tracks.size() < 3)
			return;
		if (connection.getPlayingTrack() != null) {
			for (int i = tracks.size() - 2; i > 1; i--) {
				int n = (int) Math.floor(Math.random() * (i));
				if (n != 0) {
					AudioTrack temp = tracks.get(i);
					tracks.set(i, tracks.get(n));
					tracks.set(n, temp);
				} else {
					i++;
				}
			}
		} else {
			for (int i = tracks.size() - 2; i > 0; i--) {
				int n = (int) Math.floor(Math.random() * (i));
				AudioTrack temp = tracks.get(i);
				tracks.set(i, tracks.get(n));
				tracks.set(n, temp);
			}
		}
	}

	@Override
	public void started(AudioTrack track) {
		sendEmbed();
	}

	public void startNext() {
		if (connection.isPaused()) {
			connection.resume();
			return;
		}
		AudioTrack cp = connection.getPlayingTrack();
		if ((cp == null || cp.getState() == AudioTrackState.FINISHED) && tracks.size() > 0) {
			logger.info("starting next track");
			connection.play(tracks.get(0));
		} else {
			logger.info("not starting a new track");
		}
	}

	@Override
	public void trackLoaded(AudioTrack track) {
		tracks.add(track);
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7).setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
		DLUser user = connection.getLoader().user;
		AudioTrackInfo info = track.getInfo();
		embed.setAuthor(user.getUsername(), info.uri, user.getAvatar().toString());
		embed.addField("Added Track", String.format("The track [*%s*](%s) by *%s* has been added to the playlist", info.title, info.uri, info.author));
		boundChannel.sendEmbed(embed);
		startNext();
	}

	public void trackLoaded(AudioTrack track, IUser requester) {
		tracks.add(track);
		RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7).setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
		DLUser user = connection.getLoader().user;
		AudioTrackInfo info = track.getInfo();
		embed.setAuthor(user.getUsername(), info.uri, user.getAvatar().toString());
		embed.addField("Added Track", String.format("The track [*%s*](%s) by *%s* has been added to the playlist", info.title, info.uri, info.author), true);
		embed.addField("Requested by", requester.asMention(), true);
		boundChannel.sendEmbed(embed);
		startNext();
	}

	private void sendEmbed() {
		if (nowplaying != null) {
			if (nowplaying.getID() == boundChannel.getLastMessageID()) {
				RichEmbed embed = RichEmbed.from(nowplaying.getEmbeds().get(0));
				AudioTrackInfo info = getPlayingTrack() == null ? null : getPlayingTrack().getInfo();
				if (info != null)
					embed.getFields().get(0).setValue(String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
				embed.getFields().get(1).setValue(String.format("%d", connection.getVolume()) + "%");
				embed.getFields().get(2).setValue(getTime());
				if (embed.getFields().size() >= 4 && tracks.size() > 1 && tracks.get(1) != null) {
					AudioTrackInfo next = tracks.get(1).getInfo();
					embed.getFields().get(3).setValue(String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
				}
				embed.setTimestamp(OffsetDateTime.now());
				embed.setThumbnail("attachment://" + (connection.isPaused() ? "Pause.png" : "Play.png"));
				nowplaying.edit(embed).thenAcceptAsync(msg -> {
					nowplaying = msg;
				});
				return;
			} else {
				nowplaying.delete().thenAcceptAsync(n -> {
					AudioTrackInfo info = connection.getPlayingTrack().getInfo();
					RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
					embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
					embed.addField("Now Playing", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
					embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
					embed.addField("Current Time", getTime(), true);
					if (tracks.size() > 1 && tracks.get(1) != null) {
						AudioTrackInfo next = tracks.get(1).getInfo();
						embed.addField("Up Next", String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
					}
					embed.setThumbnail(playing);
					boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
						if (!useReactions)
							return;
						nowplaying = msg;
						nowplaying.addReaction(connection.isPaused() ? "▶" : "⏸").thenAccept(a -> {
							nowplaying.addReaction("🔀").thenAccept(b -> {
								nowplaying.addReaction("🔄").thenAccept(c -> {
									nowplaying.addReaction("⏏").thenAccept(z -> {
										if (tracks.size() > 1 && tracks.get(1) != null)
											nowplaying.addReaction("⏭");
										nowplaying.addReaction("🔇").thenAccept(d -> {
											nowplaying.addReaction("🔉").thenAccept(e -> {
												nowplaying.addReaction("🔊").thenAccept(f -> {});
											});
										});
									});
								});
							});
						});
					});
				});
			}
		} else {
			AudioTrackInfo info = connection.getPlayingTrack().getInfo();
			RichEmbed embed = new RichEmbed("Music Player").setColor(0x2566C7);
			embed.setFooter("R3alB0t 2017").setTimestamp(OffsetDateTime.now());
			embed.addField("Now Playing", String.format("[*%s*](%s) - %s", info.title, info.uri, info.author));
			embed.addField("Volume", String.format("%d", connection.getVolume()) + "%", true);
			embed.addField("Current Time", getTime(), true);
			if (tracks.size() > 1 && tracks.get(1) != null) {
				AudioTrackInfo next = tracks.get(1).getInfo();
				embed.addField("Up Next", String.format("[*%s*](%s) - %s", next.title, next.uri, next.author));
			}
			embed.setThumbnail(connection.isPaused() ? pause : playing);
			boundChannel.sendEmbed(embed).thenAcceptAsync(msg -> {
				nowplaying = msg;
				if (boundChannel.permissionsOf(boundChannel.getGuild().getCurrentMember()).hasPermission(Permissions.ADD_REACTIONS))
					nowplaying.addReaction(connection.isPaused() ? "▶" : "⏸").thenAccept(a -> {
						nowplaying.addReaction(connection.isPaused() ? "▶" : "⏸").thenAccept(v -> {
							nowplaying.addReaction("🔀").thenAccept(b -> {
								nowplaying.addReaction("🔄").thenAccept(c -> {
									nowplaying.addReaction("⏏").thenAccept(z -> {
										if (tracks.size() > 1 && tracks.get(1) != null)
											nowplaying.addReaction("⏭");
										nowplaying.addReaction("🔇").thenAccept(d -> {
											nowplaying.addReaction("🔉").thenAccept(e -> {
												nowplaying.addReaction("🔊").thenAccept(f -> {});
											});
										});
									});
								});
							});
						});
					});
			});
		}
	}

	public long getPosition() {
		return position;
	}

	public void setPosition(long position) {
		this.position = position;
	}
}
