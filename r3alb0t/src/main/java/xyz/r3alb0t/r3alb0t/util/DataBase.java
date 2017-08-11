package xyz.r3alb0t.r3alb0t.util;

import redis.clients.jedis.Jedis;

/**
 * @author Perry Berman
 *
 */
public class DataBase {
	
	private static Jedis DB = new Jedis("localhost");
	
	/**
	 * 
	 */
	public DataBase() {
	}
	
	/**
	 * @return the dB
	 */
	public static Jedis getDataBase() {
		return DB;
	}
	
}
