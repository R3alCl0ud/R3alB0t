package xyz.r3alb0t.r3alb0t;

import io.discloader.discloader.common.DLOptions;
import io.discloader.discloader.common.DiscLoader;
import xyz.r3alb0t.r3alb0t.common.EventHandler;

/**
 * Hello world!
 *
 */
public class Main {
	public static void main(String[] args) {
		DLOptions options = new DLOptions("MTc0ODk4NzIyNDkxMjAzNTg0.C6G8wQ.4TabctIUZG4n0FMoRYdrJTtDp2o", "#$", true,
				true);
		DiscLoader loader = new DiscLoader(options);
		DiscLoader.addEventHandler(new EventHandler());
//		DiscLoader.addEventHandler(new GUIEvents());
		loader.login();
	}
}
