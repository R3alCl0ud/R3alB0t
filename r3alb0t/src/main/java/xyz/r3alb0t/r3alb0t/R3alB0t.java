package xyz.r3alb0t.r3alb0t;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Logger;

import com.google.gson.Gson;

import io.discloader.discloader.client.logger.DLLogger;
import io.discloader.discloader.common.DLOptions;
import io.discloader.discloader.common.DiscLoader;
import xyz.r3alb0t.r3alb0t.common.EventHandler;
import xyz.r3alb0t.r3alb0t.config.Config;

/**
 * Hello world!
 */
public class R3alB0t {

	public static final Logger logger = new DLLogger(R3alB0t.class).getLogger();

	public static Config config;
	public static Gson gson = new Gson();

	public static void main(String[] args) {
		try {
			String content = "";
			File options = new File("options.json");
			if (options.exists() && !options.isDirectory()) {
				Object[] lines = Files.readAllLines(Paths.get("./options.json")).toArray();
				for (Object line : lines)
					content += line;
				config = gson.fromJson(content, Config.class);
			} else if (!options.exists() || options.isDirectory()) {
				config = new Config();
				
				FileWriter fw = new FileWriter(options);
				fw.write(gson.toJson(config));
				fw.close();
			}
			System.out.println(gson.toJson(config));
			
			DLOptions dlOptions = new DLOptions(config.auth.token, config.prefix, true, false);
			DiscLoader loader = new DiscLoader(dlOptions);
			loader.addEventHandler(new EventHandler());
			loader.login();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
