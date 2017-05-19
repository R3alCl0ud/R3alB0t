package xyz.r3alb0t.r3alb0t.custom;

import io.discloader.discloader.entity.util.SnowflakeUtil;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;
import xyz.r3alb0t.r3alb0t.common.Commands;

/**
 * @author Perry Berman
 */
public class CustomCommands {

	private static PubSub pubSub;
	private static Jedis DB = new Jedis("localhost"), DataBase = Commands.DataBase;

	/**
	 * Loads the custom commands from the DataBase
	 */
	public static void loadCommands() {
		pubSub = new PubSub();
		DB.connect();
		DB.auth("B3$tP4$$");
		// DB.psubscribe(pubSub, "Commands.*:create", "Commands.*:delete",
		// "Commands.*:update", "Commands.*:*");
		// Set<String> titles =
		// DataBase.smembers("Commands.282226852616077312");
	}

	public static class PubSub extends JedisPubSub {

		public void onMessage(String channel, String message) {
			System.out.printf("Channel: %s\nMessage: %s\n", channel, message);
		}

		public void onSubscribe(String channel, int subscribedChannels) {
		}

		public void onUnsubscribe(String channel, int subscribedChannels) {
		}

		public void onPSubscribe(String pattern, int subscribedChannels) {
			System.out.printf("Subscribed to the [%s] pattern\n", pattern);
		}

		public void onPUnsubscribe(String pattern, int subscribedChannels) {
		}

		public void onPMessage(String pattern, String channel, String message) {
			String info = channel.substring(9);
			long guildID = SnowflakeUtil.parse(info.split(":")[0]);
			String cmd = info.split(":")[1];
			System.out.println(guildID);
			System.out.println(cmd);
			System.out.printf("Pattern: %s\nChannel: %s\nMessage: %s\n", "" + pattern, "" + channel, "" + message);
		}
	}
}
