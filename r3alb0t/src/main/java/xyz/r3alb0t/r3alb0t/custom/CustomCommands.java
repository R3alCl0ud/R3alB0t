package xyz.r3alb0t.r3alb0t.custom;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import io.discloader.discloader.entity.guild.IGuild;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * @author Perry Berman
 */
public class CustomCommands {

    private static PubSub pubSub;
    private static Jedis Subber, DB = null;
    // private static final Map<Long, Map<String, CommandJSON>> guildCommands =
    // new HashMap<>();

    /**
     * Loads the custom commands from the DataBase
     */
    public static void loadCommands() {
        if (DB == null) {
            DB = DataBase.getClient();
        }
        new Thread("PubSub thread") {

            @Override
            public void run() {
                pubSub = new PubSub();
                Subber = new Jedis("localhost");
                Subber.connect();
                Subber.psubscribe(pubSub, "Commands.*:create", "Commands.*:delete", "Commands.*:update"); // , "Commands.*:*"
            }
        }.start();
    }

    public static Map<String, CommandJSON> getCommands(IGuild guild) {
        Map<String, CommandJSON> cmds = new HashMap<>();
        String gID = SnowflakeUtil.asString(guild);
        Set<String> titles = DB.smembers("Commands." + gID);
        for (String title : titles) {
            CommandJSON cmd = new CommandJSON();
            cmd.title = title;
            cmd.message = DB.get("Commands." + gID + ":" + title);
            cmds.put(title, cmd);
        }
        return cmds;
    }

    public static String guildCommands(IGuild guild) {
        return String.format("Commands.%d", guild.getID());
    }

    public static String guildCommand(IGuild guild, String label) {
        return String.format("Commands.%d:%s", guild.getID(), label);
    }

    public static void setCommand(IGuild guild, String label, String response) {
        if (!DB.sismember(guildCommands(guild), label)) {
            DB.sadd(guildCommands(guild), label);
        }
        DB.set(guildCommand(guild, label), response);
        System.out.println("This was executed");
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
            // String info = channel.substring(9);
            // long guildID = SnowflakeUtil.parse(info.split(":")[0]);
            // String cmd = info.split(":")[1];
            System.out.printf("Pattern: %s\nChannel: %s\nMessage: %s\n", "" + pattern, "" + channel, "" + message);
        }
    }
}
