import mongoose  from 'mongoose'
import config    from './config.js'


const newSchema = function (name, options) {
  const schema = mongoose.Schema(options, {
    versionKey: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  });
  return mongoose.model(name, schema);
}

const tickets = newSchema('tickets',{
  id:             String,
  activity_id:    String,
  apply_id:       String,
  status:         String,
  ticket_cat_id:  String,
  user_id:        String,
  invite_code_id: String,
  created_at:     String,
  updated_at:     String,
  order_id:       String,
  attachment:     String,
  is_media:       String,
  notes:          String,
  ticket_no:      String,
})

const types = newSchema('types',{
  id:              String,
  name:            String,
  is_free:         String,
  price:           String,
  activity_id:     String,
  activity_ids:    String,
  priorty_type:    String,
  created_at:      String,
  updated_at:      String,
  public_offering: String,
  limit:           String,
  gen_ticket:      String,
  closing_date:    String,
  extra:           String,
  sole_out:        String,
  days:            String,
  full_time:       String,
  sum_limit:       String,
})

export default {
  connect:  () => {
    mongoose.Promise = global.Promise;
    const dbname = config.dbname;
    mongoose.connect(dbname, {
      server: { poolSize: 20 }
    }, (err) => {
      console.log(dbname);
      if (err) {
        console.error(`connect to ${$.config.db} error: ${err.message}`)
        process.exit(1);
      }
      return mongoose.connection;
    });
  },
  tickets,
  types,
}
