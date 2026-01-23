# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_01_23_002257) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "customers", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", null: false
    t.string "phone_number", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "dish_tags", force: :cascade do |t|
    t.integer "dish_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dish_id"], name: "index_dish_tags_on_dish_id"
    t.index ["tag_id"], name: "index_dish_tags_on_tag_id"
  end

  create_table "dishes", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "calories"
    t.string "photo"
    t.integer "establishment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "status", default: true, null: false
    t.index ["establishment_id"], name: "index_dishes_on_establishment_id"
  end

  create_table "drink_tags", force: :cascade do |t|
    t.integer "drink_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["drink_id"], name: "index_drink_tags_on_drink_id"
    t.index ["tag_id"], name: "index_drink_tags_on_tag_id"
  end

  create_table "drinks", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "alcoholic"
    t.integer "calories"
    t.integer "establishment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "status", default: true, null: false
    t.index ["establishment_id"], name: "index_drinks_on_establishment_id"
  end

  create_table "employee_invitations", force: :cascade do |t|
    t.integer "establishment_id", null: false
    t.string "email"
    t.string "cpf"
    t.boolean "role", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["establishment_id", "email", "cpf"], name: "idx_on_establishment_id_email_cpf_b1d41def85", unique: true
    t.index ["establishment_id"], name: "index_employee_invitations_on_establishment_id"
  end

  create_table "establishments", force: :cascade do |t|
    t.string "name", null: false
    t.string "social_name", null: false
    t.string "cnpj", null: false
    t.string "code", null: false
    t.string "full_address", null: false
    t.string "city", null: false
    t.string "state", null: false
    t.string "postal_code"
    t.string "email"
    t.string "phone_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "menu_items", force: :cascade do |t|
    t.integer "menu_id", null: false
    t.integer "drink_id"
    t.integer "dish_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dish_id"], name: "index_menu_items_on_dish_id"
    t.index ["drink_id"], name: "index_menu_items_on_drink_id"
    t.index ["menu_id"], name: "index_menu_items_on_menu_id"
  end

  create_table "menus", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.boolean "active", default: true
    t.integer "establishment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["establishment_id"], name: "index_menus_on_establishment_id"
  end

  create_table "order_menu_items", force: :cascade do |t|
    t.integer "quantity", default: 1, null: false
    t.integer "order_id"
    t.integer "menu_item_id"
    t.integer "portion_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_item_id"], name: "index_order_menu_items_on_menu_item_id"
    t.index ["order_id"], name: "index_order_menu_items_on_order_id"
    t.index ["portion_id"], name: "index_order_menu_items_on_portion_id"
  end

  create_table "orders", force: :cascade do |t|
    t.integer "establishment_id", null: false
    t.string "status", default: "draft"
    t.decimal "total_price", precision: 10, scale: 2
    t.string "customer_name"
    t.string "customer_email"
    t.string "customer_cpf"
    t.string "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "customer_phone"
    t.string "cancellation_reason"
    t.index ["establishment_id"], name: "index_orders_on_establishment_id"
  end

  create_table "portions", force: :cascade do |t|
    t.string "description"
    t.decimal "price"
    t.integer "drink_id"
    t.integer "dish_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_portions_on_deleted_at"
    t.index ["dish_id"], name: "index_portions_on_dish_id"
    t.index ["drink_id"], name: "index_portions_on_drink_id"
  end

  create_table "price_histories", force: :cascade do |t|
    t.decimal "price", precision: 10, scale: 2
    t.integer "portion_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["portion_id"], name: "index_price_histories_on_portion_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "last_name", null: false
    t.string "cpf", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.boolean "role", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "working_hours", force: :cascade do |t|
    t.string "opening_hour"
    t.string "closing_hour"
    t.string "week_day"
    t.boolean "open", default: true
    t.integer "establishment_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["establishment_id"], name: "index_working_hours_on_establishment_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "dish_tags", "dishes"
  add_foreign_key "dish_tags", "tags"
  add_foreign_key "dishes", "establishments"
  add_foreign_key "drink_tags", "drinks"
  add_foreign_key "drink_tags", "tags"
  add_foreign_key "drinks", "establishments"
  add_foreign_key "employee_invitations", "establishments"
  add_foreign_key "menu_items", "dishes"
  add_foreign_key "menu_items", "drinks"
  add_foreign_key "menu_items", "menus"
  add_foreign_key "menus", "establishments"
  add_foreign_key "order_menu_items", "menu_items"
  add_foreign_key "order_menu_items", "orders"
  add_foreign_key "order_menu_items", "portions"
  add_foreign_key "orders", "establishments"
  add_foreign_key "portions", "dishes"
  add_foreign_key "portions", "drinks"
  add_foreign_key "price_histories", "portions"
  add_foreign_key "working_hours", "establishments"
end
