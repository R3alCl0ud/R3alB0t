package xyz.r3alb0t.r3alb0t.util;

import redis.clients.jedis.Jedis;
import xyz.r3alb0t.r3alb0t.R3alB0t;

/**
 * @author Perry Berman
 */
public class DataBase {

	private static Jedis db = null;

	public static void connect() {
		if (db == null) db = new Jedis(R3alB0t.config.auth.dbIP);
		if (db.isConnected()) return;
		db.connect();
		if (!R3alB0t.config.auth.dbPassword.equals("PASSWORD")) db.auth(R3alB0t.config.auth.dbPassword);
	}

	/**
	 * @return the dB
	 * @deprecated Use {@link #getClient()} instead
	 */
	public static Jedis getDataBase() {
		return getClient();
	}

	/**
	 * @return the dB
	 */
	public static Jedis getClient() {
		return db;
	}

}
