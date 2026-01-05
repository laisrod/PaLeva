class CreateWorkingHours < ActiveRecord::Migration[7.2]
  def change
    create_table :working_hours do |t|
      t.string :opening_hour
      t.string :closing_hour
      t.string :week_day
      t.boolean :open, default: true
      t.references :establishment, null: false, foreign_key: true

      t.timestamps
    end
  end
end
