package xyz.r3alb0t.r3alb0t;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.logging.Logger;

import com.google.gson.Gson;

import io.discloader.discloader.common.DLOptions;
import io.discloader.discloader.common.Shard;
import io.discloader.discloader.common.ShardManager;
import io.discloader.discloader.common.event.sharding.ShardLaunchedEvent;
import io.discloader.discloader.common.event.sharding.ShardingListenerAdapter;
import io.discloader.discloader.common.logger.DLLogger;
import xyz.r3alb0t.r3alb0t.common.EventHandler;
import xyz.r3alb0t.r3alb0t.common.LogHandler;
import xyz.r3alb0t.r3alb0t.config.Config;
import xyz.r3alb0t.r3alb0t.util.DataBase;

/**
 * Hello world!
 */
public class R3alB0t {

	public static final Logger logger = DLLogger.getLogger(R3alB0t.class);

	public static final Config config = new Config();
	public static final Gson gson = new Gson();
	private static ShardManager manager;

	public static void main(String[] args) {
		try {
			readConfig();
			DataBase.connect();
			DLOptions dlOptions = new DLOptions(config.auth.token, config.prefix, true);
			dlOptions.setDebug(true);
			dlOptions.useDefaultCommands(false);
			dlOptions.setSharding(0, 2);
			ShardManager manager = new ShardManager(dlOptions);
			manager.addShardingListener(new ShardingListenerAdapter() {

				@Override
				public void onShardLaunched(ShardLaunchedEvent e) {
					Shard shard = e.getShard();
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

	public static void readConfig() throws IOException {
		File options = new File("options.json");
		if (options.exists() && !options.isDirectory()) {
			String content = "";
			List<String> lines = Files.readAllLines(Paths.get("./options.json"));
			for (String line : lines)
				content += line;
			config.update(gson.fromJson(content, Config.class));
		} else if (!options.exists() || options.isDirectory()) {
			try (FileWriter fw = new FileWriter(options)) {
				fw.write(gson.toJson(config));
			}
		}
	}

	/**
	 * @return the manager
	 */
	public static ShardManager getShardManager() {
		return manager;
	}

	public static int getYear() {
		return 1970 + (int) (System.currentTimeMillis() / 31556952000l);
	}

	public static String getCopyrightInfo() {
		return String.format("©R3alB0t.xyz %d", getYear());
	}

}
