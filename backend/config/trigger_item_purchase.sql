--PROCESSO PARA ATUALIZAR TABELA PURCHASE, APÓS INSERÇÃO, REMOÇÃO E ATUALIZAÇÃO NA TABELA
--ITEM_PURCHASE

CREATE OR REPLACE FUNCTION update_purchase_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar o total da tabela 'purchase' após uma inserção ou atualização
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE purchase
        SET total_price = (
            SELECT SUM(ip.quantity * ip.cost_price)
            FROM item_purchase ip
            WHERE ip.id_purchase = NEW.id_purchase
        )
        WHERE id = NEW.id_purchase;
    END IF;

    -- Atualizar o total da tabela 'purchase' após a exclusão de um item
    IF (TG_OP = 'DELETE') THEN
        UPDATE purchase
        SET total_price = (
            SELECT COALESCE(SUM(ip.quantity * ip.cost_price), 0)
            FROM item_purchase ip
            WHERE ip.id_purchase = OLD.id_purchase
        )
        WHERE id = OLD.id_purchase;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------------------------

CREATE TRIGGER item_purchase_changes
AFTER INSERT OR UPDATE OR DELETE
ON item_purchase
FOR EACH ROW
EXECUTE FUNCTION update_purchase_total();

----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_item_purchase_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar o total da tabela 'purchase' após uma inserção ou atualização
    IF (TG_OP = 'INSERT') THEN
        UPDATE item_purchase
        SET item_count = (
            SELECT max(item_count) + 1
            FROM item_purchase ip
            WHERE ip.id_purchase = NEW.id_purchase
        )
        WHERE id = NEW.id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------------------------

CREATE TRIGGER item_purchase_insert
AFTER INSERT
ON item_purchase
FOR EACH ROW
EXECUTE FUNCTION update_item_purchase_count();

----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_stock_by_item_purchase()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar o total da tabela 'purchase' após uma inserção ou atualização
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE stock
        SET quantity = (
            SELECT SUM(ip.quantity)
            FROM item_purchase ip
            WHERE ip.id_purchase = NEW.id_purchase
			  AND ip.id_product = NEW.id_product
        ),
        sales_tips = (
            SELECT 
                sales_tips
            FROM item_purchase ip
            WHERE ip.id_purchase = NEW.id_purchase
			  AND ip.id_product = NEW.id_product
            ORDER BY id DESC
            LIMIT 1
        )
        WHERE id_product = NEW.id_product;
    END IF;

    -- Atualizar o total da tabela 'purchase' após a exclusão de um item
    IF (TG_OP = 'DELETE') THEN
        UPDATE stock
        SET quantity = (
            SELECT SUM(ip.quantity)
            FROM item_purchase ip
            WHERE ip.id_purchase = NEW.id_purchase
			  AND ip.id_product = NEW.id_product
        ),
        sales_tips = (
            SELECT 
                sales_tips
            FROM item_purchase ip
            WHERE ip.id_purchase = NEW.id_purchase
			  AND ip.id_product = NEW.id_product
            ORDER BY id DESC
            LIMIT 1
        )
        WHERE id_product = NEW.id_product;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------------------------

CREATE TRIGGER item_purchase_edit_stock
AFTER INSERT OR DELETE OR UPDATE
ON item_purchase
FOR EACH ROW
EXECUTE FUNCTION update_stock_by_item_purchase();