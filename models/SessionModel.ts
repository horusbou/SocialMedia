import db from '../util/database';
import { DataTypes,Model } from 'sequelize';

export const Session = db.define(
	'Session',
	{
		sessionId: {
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
		},
		userId: { type: DataTypes.UUID, allowNull: false },
		valid: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
		userAgent: { type: DataTypes.STRING },
	},
	{ timestamp: true }
);
export interface SessionInterface extends Model {
	sessionId: string;
	userId: string;
	valid: boolean;
	userAgent: string;
	createdAt: Date;
	updatedAt: Date;
}
