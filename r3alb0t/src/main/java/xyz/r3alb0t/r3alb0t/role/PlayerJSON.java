package xyz.r3alb0t.r3alb0t.role;

import io.discloader.discloader.entity.user.IUser;

public class PlayerJSON {
	private int discriminator;
	private double exp;
	private long id;
	private String name;
	private long lastSpoke;

	public PlayerJSON() {}

	public PlayerJSON(IUser user) {
		this.id = user.getID();
		this.name = user.getUsername();
		this.discriminator = user.getDiscriminator();
		this.exp = 0.0d;
		this.lastSpoke = 0;
	}

	public void addExp(double exp) {
		this.exp += exp;
	}
	
	/**
	 * @return the discriminator
	 */
	public int getDiscriminator() {
		return discriminator;
	}

	/**
	 * @return the exp
	 */
	public double getExp() {
		return exp;
	}

	/**
	 * @return the id
	 */
	public long getID() {
		return id;
	}

	/**
	 * @return the lastSpoke
	 */
	public long getLastSpoke() {
		return lastSpoke;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param discriminator
	 *            the discriminator to set
	 */
	public void setDiscriminator(int discriminator) {
		this.discriminator = discriminator;
	}

	/**
	 * @param exp
	 *            the exp to set
	 */
	public void setExp(double exp) {
		this.exp = exp;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setID(long id) {
		this.id = id;
	}

	/**
	 * @param lastSpoke
	 *            the lastSpoke to set
	 */
	public void setLastSpoke(long lastSpoke) {
		this.lastSpoke = lastSpoke;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
}
