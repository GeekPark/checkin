import mongoose  from 'mongoose'
import config    from './config'


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
  user_id:        {type: String, index: true},
  checkin:        {type:Boolean, default: false},
  id:             String,
  activity_id:    String,
  apply_id:       String,
  status:         String,
  ticket_cat_id:  String,
  invite_code_id: String,
  created_at:     String,
  updated_at:     String,
  order_id:       String,
  attachment:     String,
  is_media:       String,
  notes:          String,
  ticket_no:      String,
  checkin_time:   String,
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

const users = newSchema('users', {
  id:                 String,
  token:              String,
  expires_at:         String,
  tags:               String,
  role:               String,
  username:           String,
  email:              String,
  realname:           String,
  mobile:             String,
  company:            String,
  position:           String,
  avatar:             String,
  bio:                String,
  city:               String,
  created_at:         String,
  updated_at:         String,
  mygeekpark_open_id: String,
  is_media:           String,
  refresh_token:      String,
  checked_count:      String,
  gender:             String,
  birthday:           String,
  privacy_level:      String,
  muted:              String
})

const personal_infos = newSchema('personal_infos', {
  email:      {type: String, index: true},
  realname:   {type: String, index: true},
  mobile:     {type: String, index: true},
  id:         String,
  user_id:    String,
  company:    String,
  position:   String,
  created_at: String,
  updated_at: String,
  industry:   String,
  competency: String,
  card:       String
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
        console.error(`connect to ${dbname} error: ${err.message}`)
        process.exit(1);
      }
      return mongoose.connection;
    });
  },
  tickets,
  types,
  users,
  personal_infos
}
