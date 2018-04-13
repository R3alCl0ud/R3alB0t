package xyz.r3alb0t.r3alb0t.common;

import java.util.logging.Logger;

import io.discloader.discloader.common.logger.DLLogger;
import xyz.r3alb0t.r3alb0t.R3alB0t;

public class LogHandler {

	public static final Logger logger = DLLogger.getLogger(R3alB0t.class);

	public static void throwing(Throwable ex) {
		print(ex, "", "");
		// for (StackTraceElement el : ex.getStackTrace())
		// logger.severe("\tat " + el);
		// for (Throwable sup : ex.getSuppressed())
		// print(sup, "Suppressed: ", "\t");
		// if (ex.getCause() != null)
		// print(ex.getCause(), "Caused by: ", "");
	}

	public static void print(Throwable ex, String caption, String prefix) {
		logger.severe(String.format("%s%s%s", prefix, caption, ex));
		for (StackTraceElement el : ex.getStackTrace())
			logger.severe(prefix + "\tat " + el);
		for (Throwable sup : ex.getSuppressed())
			print(sup, "Suppressed: ", prefix + "\t");
		if (ex.getCause() != null)
			print(ex.getCause(), "Caused by: ", prefix);
	}

}
