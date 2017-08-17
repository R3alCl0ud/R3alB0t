package xyz.r3alb0t.r3alb0t.currency;

import io.discloader.discloader.core.entity.user.UserAvatar;
import io.discloader.discloader.entity.IIcon;
import io.discloader.discloader.entity.user.IUser;
import io.discloader.discloader.entity.util.SnowflakeUtil;
import io.discloader.discloader.util.DLUtil;

public class AccountJSON {

	private String id;
	private String username;
	private String avatar;
	private short discriminator;
	private long balance;

	public AccountJSON() {

	}

	public AccountJSON(IUser user) {
		username = user.getUsername();
		discriminator = user.getDiscriminator();
		id = SnowflakeUtil.asString(user);
		avatar = user.getAvatar().getHash();
		balance = 0l;
	}

	/**
	 * @return the avatar
	 */
	public IIcon getAvatar() {
		return new UserAvatar(avatar, SnowflakeUtil.parse(id), discriminator);
	}

	/**
	 * @return the balance
	 */
	public long getBalance() {
		return balance;
	}

	/**
	 * @return the discriminator
	 */
	public short getDiscriminator() {
		return discriminator;
	}

	/**
	 * @return the id
	 */
	public long getId() {
		return SnowflakeUtil.parse(id);
	}

	/**
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * @param avatar the avatar to set
	 */
	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	/**
	 * @param balance the balance to set
	 */
	public void setBalance(long balance) {
		this.balance = balance;
	}

	/**
	 * @param disciminator the disciminator to set
	 */
	public void setDiscriminator(short discriminator) {
		this.discriminator = discriminator;
	}

	/**
	 * @param username the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	public String toString() {
		return DLUtil.gson.toJson(this);
	}

	public void update(IUser user) {
		username = user.getUsername();
		discriminator = user.getDiscriminator();
		avatar = user.getAvatar().getHash();
	}
}
