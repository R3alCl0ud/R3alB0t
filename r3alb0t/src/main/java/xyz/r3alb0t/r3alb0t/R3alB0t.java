package xyz.r3alb0t.r3alb0t;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.logging.Logger;

import com.google.gson.Gson;

import io.discloader.discloader.client.logger.DLLogger;
import io.discloader.discloader.common.DLOptions;
import io.discloader.discloader.common.Shard;
import io.discloader.discloader.common.ShardManager;
import io.discloader.discloader.common.event.sharding.ShardingListenerAdapter;
import xyz.r3alb0t.r3alb0t.common.EventHandler;
import xyz.r3alb0t.r3alb0t.common.LogHandler;
import xyz.r3alb0t.r3alb0t.config.Config;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * Hello world!
 */
public class R3alB0t {

	public static final Logger logger = new DLLogger(R3alB0t.class).getLogger();

	public static Config config;
	public static Gson gson = new Gson();
	private static ShardManager manager;

	public static void main(String[] args) {
		try {
			File options = new File("options.json");
			if (options.exists() && !options.isDirectory()) {
				String content = "";
				List<String> lines = Files.readAllLines(Paths.get("./options.json"));
				for (String line : lines)
					content += line;
				config = gson.fromJson(content, Config.class);
			} else if (!options.exists() || options.isDirectory()) {
				config = new Config();
				FileWriter fw = new FileWriter(options);
				fw.write(gson.toJson(config));
				fw.close();
			}
			DataBase.connect();
			DLOptions dlOptions = new DLOptions(config.auth.token, config.prefix, true);
			dlOptions.setSharding(0, 2);
			ShardManager manager = new ShardManager(dlOptions);
			manager.addShardingListener(new ShardingListenerAdapter() {

				public void ShardLaunched(Shard shard) {
					logger.info(String.format("Shard #%d: Launched", shard.getShardID()));
					shard.getLoader().addEventListener(new EventHandler(shard));
				}
			});
			logger.info("Launching shards");
			manager.launchShards();
		} catch (Exception e) {
			LogHandler.throwing(e);
		}
	}

	/**
	 * @return the manager
	 */
	public static ShardManager getShardManager() {
		return manager;
	}

}
