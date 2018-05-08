package xyz.r3alb0t.r3alb0t.role;

public class PlayerUtil {

	private static double f(double x) {
		if (x <= 0 || x >= 12)
			return 0;
		return Math.sin((x + 4) * (Math.PI / 16));
	}

	private static double g(int w, int l) {
		if (w == 0)
			return 0;
		return l / w;
	}

	public static double getEXPFromMessage(String message) {
		int w = 0, l = 0;
		String[] words = message.split("\\ +");
		for (int i = 0; i < words.length; i++) {
			if (words[i].length() > 0 && !words[i].contains(" ")) {
				w += 1;
				l += words[i].length();
			}
		}
		return Math.max(0, h(w, l) + Math.log(l));
	}

	private static double h(int w, int l) {
		return f(g(w, l));
	}

	public static double getEXPForLevel(long level) {
		if (level == 2)
			return 15;
		if (level == 3)
			return 45;
		if (level > 3)
			return getEXPForLevel(level - 1) + (getEXPForLevel(level - 1) - getEXPForLevel(level - 2));
		return 0;
	}

	public static long getLevelFromEXP(double exp) {
		long level = 2;
		while (exp > getEXPForLevel(level))
			level++;
		return level - 1;
	}

}
