package com.slayniaccc.sportsconflicttracker.service;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

final class DateParsing {

    private static final Logger log = LoggerFactory.getLogger(DateParsing.class);

    private DateParsing() {}

    static Instant parseOrNull(String raw, String context) {
        if (raw == null || raw.isBlank()) {
            log.warn("Skipping fixture — null/blank date for {}", context);
            return null;
        }
        try {
            return Instant.parse(raw);
        } catch (DateTimeParseException e) {
            log.warn("Skipping fixture — unparseable date '{}' for {}", raw, context);
            return null;
        }
    }
}