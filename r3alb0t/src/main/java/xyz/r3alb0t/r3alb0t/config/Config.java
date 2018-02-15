package xyz.r3alb0t.r3alb0t.config;

public class Config {

	public String prefix = "c!";
	public Auth auth = new Auth();

	public class Auth {
		public String token = "TOKEN";
		public String dbIP = "localhost";
		public String dbPassword = "PASSWORD";
	}

}
