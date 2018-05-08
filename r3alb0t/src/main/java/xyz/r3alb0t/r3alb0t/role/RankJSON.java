package xyz.r3alb0t.r3alb0t.role;

import io.discloader.discloader.entity.guild.IRole;

public class RankJSON {

	private long id;
	private String name;
	private int color;
	private long level;

	public RankJSON() {}

	public RankJSON(IRole role, long level) {
		this.name = role.getName();
		this.id = role.getID();
		this.color = role.getColor();
		this.level = level;
	}

	/**
	 * @return the color
	 */
	public int getColor() {
		return color;
	}

	/**
	 * @return the id
	 */
	public long getID() {
		return id;
	}

	/**
	 * @return the level
	 */
	public long getLevel() {
		return level;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param color
	 *            the color to set
	 */
	public void setColor(int color) {
		this.color = color;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setID(long id) {
		this.id = id;
	}

	/**
	 * @param level
	 *            the level to set
	 */
	public void setLevel(long level) {
		this.level = level;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	public String toString() {
		return String.format("Level: %d, Name: %s, ID: %d", level, name, id);
	}

}
