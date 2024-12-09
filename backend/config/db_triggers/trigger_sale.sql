CREATE OR REPLACE FUNCTION validate_payment_total()
RETURNS TRIGGER AS $$
DECLARE
    total_payments NUMERIC(10, 2);
BEGIN	
    -- Calcula a soma atual dos pagamentos para a venda
    SELECT COALESCE(SUM(value), 0)
    INTO total_payments
    FROM payment
    WHERE id_sale = NEW.id_sale;

    -- Soma o valor do novo pagamento
    total_payments := COALESCE(total_payments, 0) + NEW.value;

    -- Verifica se a soma excede o valor total da venda
    IF total_payments > (SELECT total_sale FROM sale WHERE id = NEW.id_sale) THEN
        RAISE EXCEPTION 'A soma dos pagamentos excede o valor total da venda.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER check_payment_total
BEFORE INSERT OR UPDATE ON payment
FOR EACH ROW
EXECUTE FUNCTION validate_payment_total();