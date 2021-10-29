import db from '../util/database';
import { DataTypes,Model } from 'sequelize';

export const Timeline = db.define('Timeline',{
  timelineId: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  }
})
export interface TimelineInterface extends Model {
	TimelineId: string;
	userId: string;
	postId: boolean;
	createdAt: Date;
	updatedAt: Date;
}
