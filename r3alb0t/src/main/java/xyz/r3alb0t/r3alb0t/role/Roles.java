package xyz.r3alb0t.r3alb0t.role;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.guild.IRole;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import xyz.r3alb0t.r3alb0t.util.DataBase;

public class Roles {

	public static final String rankGuilds = "ranks.guilds";
	public static final Gson gson = new Gson();

	public static RankJSON getRank(IGuild guild, long level) {
		if (guild == null || !DataBase.getClient().sismember(guildLevels(guild), Long.toUnsignedString(level, 10)))
			return null;
		return gson.fromJson(DataBase.getClient().get(guildRank(guild, level)), RankJSON.class);
	}

	public static List<RankJSON> getRanks(IGuild guild) {
		List<RankJSON> list = new ArrayList<>();
		if (guild != null && isGuildEnabled(guild)) {
			for (String level : DataBase.getClient().smembers(guildLevels(guild))) {
				list.add(gson.fromJson(DataBase.getClient().get(guildRank(guild, level)), RankJSON.class));
			}
		}
		list.sort((a, b) -> {
			if (a.getLevel() < b.getLevel())
				return -1;
			if (a.getLevel() > b.getLevel())
				return 1;
			return 0;
		});
		return list;
	}

	public static List<PlayerJSON> getPlayers(IGuild guild) {
		List<PlayerJSON> list = new ArrayList<>();
		for (String playerID : DataBase.getClient().smembers(guildPlayers(guild))) {
			list.add(gson.fromJson(DataBase.getClient().get(guildPlayer(guild, playerID)), PlayerJSON.class));
		}
		list.sort((a, b) -> {
			if (a.getName().length() != b.getName().length()) {
				int endIndex = Math.max(Math.min(a.getName().length(), b.getName().length()) - 1, 0);
				if (a.getName().substring(0, endIndex).compareTo(b.getName().substring(0, endIndex)) != 0) {
					return a.getName().substring(0, endIndex).compareTo(b.getName().substring(0, endIndex));
				}
			}
			if (a.getDiscriminator() < b.getDiscriminator())
				return -1;
			if (a.getDiscriminator() > b.getDiscriminator())
				return 1;
			return 0;
		});
		return list;
	}

	public static PlayerJSON getPlayer(IGuild guild, long playerID) {
		if (guild == null || !DataBase.getClient().sismember(guildPlayers(guild), Long.toUnsignedString(playerID, 10)))
			return null;
		return gson.fromJson(DataBase.getClient().get(guildRank(guild, playerID)), PlayerJSON.class);
	}

	public static String guildLevels(IGuild guild) {
		return String.format("ranks.%d:ranks", guild.getID());
	}

	public static String guildPlayers(IGuild guild) {
		return String.format("ranks.%d:players", guild.getID());
	}

	public static String guildPlayer(IGuild guild, long playerID) {
		return String.format("ranks.%d:player.%d", guild.getID(), playerID);
	}

	public static String guildPlayer(IGuild guild, String playerID) {
		return String.format("ranks.%d:player.%s", guild.getID(), playerID);
	}

	public static String guildRank(IGuild guild, long level) {
		return String.format("ranks.%d:rank.%d", guild.getID(), level);
	}

	public static String guildRank(IGuild guild, String level) {
		return String.format("ranks.%d:rank.%s", guild.getID(), level);
	}

	public static void setRank(IRole role, long level) {
		DataBase.getClient().sadd(guildLevels(role.getGuild()), Long.toUnsignedString(level, 10));
		DataBase.getClient().set(guildRank(role.getGuild(), level), gson.toJson(new RankJSON(role, level)));
	}

	public static void setPlayer(IGuild guild, PlayerJSON player) {
		DataBase.getClient().sadd(guildLevels(guild), Long.toUnsignedString(player.getID(), 10));
		DataBase.getClient().set(guildPlayer(guild, player.getID()), gson.toJson(player));
	}

	public static void delRank(IGuild guild, long level) {
		DataBase.getClient().srem(guildLevels(guild), Long.toUnsignedString(level, 10));
		DataBase.getClient().del(guildRank(guild, level));
	}

	public static void setGuildEnabled(IGuild guild, boolean enabled) {
		if (enabled) {
			DataBase.getClient().sadd(rankGuilds, SnowflakeUtil.asString(guild));
		} else {
			DataBase.getClient().srem(rankGuilds, SnowflakeUtil.asString(guild));
		}
	}

	public static boolean isGuildEnabled(IGuild guild) {
		return DataBase.getClient().sismember(rankGuilds, SnowflakeUtil.asString(guild));
	}

}
