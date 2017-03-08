package xyz.r3alb0t.r3alb0t;

import io.discloader.discloader.client.command.CommandHandler;
import io.discloader.discloader.common.DiscLoader;
import xyz.r3alb0t.r3alb0t.common.EventHandler;

/**
 * Hello world!
 *
 */
public class Main {
	public static void main(String[] args) {
		DiscLoader loader = new DiscLoader();
		CommandHandler.prefix = "#$";
		DiscLoader.addEventHandler(new EventHandler());
		loader.login("MTc0ODk4NzIyNDkxMjAzNTg0.C6G8wQ.4TabctIUZG4n0FMoRYdrJTtDp2o");
	}
}
