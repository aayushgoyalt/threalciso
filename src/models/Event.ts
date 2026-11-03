import mongoose, { Schema, Document, Model } from 'mongoose';

export type EventType = 'webinar' | 'roundtable' | 'summit' | 'conference';
export type DerivedEventStatus = 'upcoming' | 'ongoing' | 'past';

export interface IEventSpeaker {
  name: string;
  title: string;
  company: string;
  avatar?: string;
}

export interface IEvent extends Document {
  title: string;
  slug: string;
  type: EventType;
  startDate: Date;
  endDate?: Date;
  location: string;
  description: string;
  coverImage: string;
  registrationUrl: string;
  speakers: IEventSpeaker[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: {
      type: String,
      enum: ['webinar', 'roundtable', 'summit', 'conference'],
      default: 'webinar',
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date },
    location: { type: String, default: 'Virtual (Online)' },
    description: { type: String, required: true },
    coverImage: { type: String, default: '' },
    registrationUrl: { type: String, default: '' },
    speakers: [
      {
        name: { type: String, required: true },
        title: { type: String, default: '' },
        company: { type: String, default: '' },
        avatar: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to dynamically derive event status at runtime based on dates
EventSchema.virtual('derivedStatus').get(function (this: IEvent): DerivedEventStatus {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = this.endDate ? new Date(this.endDate) : new Date(start.getTime() + 4 * 60 * 60 * 1000);

  if (now < start) {
    return 'upcoming';
  } else if (now >= start && now <= end) {
    return 'ongoing';
  } else {
    return 'past';
  }
});

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

