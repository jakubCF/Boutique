-- Create the trigger function
CREATE OR REPLACE FUNCTION fn_log_item_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO "ItemHistory" (
      item_id, name, brand, buy_price, listing_price, item_desc,
      purchase_date, sold_date, sold, web_url, made_in,
      posh_category, posh_picture_url, posh_created_at,
      posh_root_ancestor_post_id, posh_size, posh_user,
      bin_id, sysdate, change_type
    ) VALUES (
      NEW.id, NEW.name, NEW.brand, NEW.buy_price, NEW.listing_price, NEW.item_desc,
      NEW.purchase_date, NEW.sold_date, NEW.sold, NEW.web_url, NEW.made_in,
      NEW.posh_category, NEW.posh_picture_url, NEW.posh_created_at,
      NEW.posh_root_ancestor_post_id, NEW.posh_size, NEW.posh_user,
      NEW.bin_id, NEW.sysdate, 'INSERT'
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO "ItemHistory" (
      item_id, name, brand, buy_price, listing_price, item_desc,
      purchase_date, sold_date, sold, web_url, made_in,
      posh_category, posh_picture_url, posh_created_at,
      posh_root_ancestor_post_id, posh_size, posh_user,
      bin_id, sysdate, change_type
    ) VALUES (
      OLD.id, OLD.name, OLD.brand, OLD.buy_price, OLD.listing_price, OLD.item_desc,
      OLD.purchase_date, OLD.sold_date, OLD.sold, OLD.web_url, OLD.made_in,
      OLD.posh_category, OLD.posh_picture_url, OLD.posh_created_at,
      OLD.posh_root_ancestor_post_id, OLD.posh_size, OLD.posh_user,
      OLD.bin_id, OLD.sysdate, 'UPDATE'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO "ItemHistory" (
      item_id, name, brand, buy_price, listing_price, item_desc,
      purchase_date, sold_date, sold, web_url, made_in,
      posh_category, posh_picture_url, posh_created_at,
      posh_root_ancestor_post_id, posh_size, posh_user,
      bin_id, sysdate, change_type
    ) VALUES (
      OLD.id, OLD.name, OLD.brand, OLD.buy_price, OLD.listing_price, OLD.item_desc,
      OLD.purchase_date, OLD.sold_date, OLD.sold, OLD.web_url, OLD.made_in,
      OLD.posh_category, OLD.posh_picture_url, OLD.posh_created_at,
      OLD.posh_root_ancestor_post_id, OLD.posh_size, OLD.posh_user,
      OLD.bin_id, OLD.sysdate, 'DELETE'
    );
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger (on item table — assumes it exists in the DB!)
DROP TRIGGER IF EXISTS trg_item_history ON "Item";

CREATE TRIGGER trg_item_history
AFTER UPDATE OR DELETE ON "Item"
FOR EACH ROW EXECUTE FUNCTION fn_log_item_change();
