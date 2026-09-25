package com.slayniaccc.sportsconflicttracker.client;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class BallDontLieClient {

    private static final int PER_PAGE = 100;

    private static final int MAX_PAGES = 200;
      private static final long INTER_PAGE_DELAY_MS = 13_000;

    private final RestClient restClient;

    public BallDontLieClient() {
        this.restClient = RestClient.builder()
            .baseUrl("https://api.balldontlie.io")
            .defaultStatusHandler(
                HttpStatusCode::isError,
                (req, res) -> {
                    throw new BallDontLieException(
                        "BALLDONTLIE " + res.getStatusCode() + " on " + req.getURI());
                })
            .build();
    }

 
    public <T, R> List<T> fetchAll(
            String apiKey,
            String basePath,
            Map<String, String> extraParams,
            Class<R> responseType,
            Function<R, List<T>> dataExtractor,
            Function<R, Integer> cursorExtractor) {

        List<T> all = new ArrayList<>();
        Integer cursor = null;  // null on the first pass means "start from the beginning"
        int page = 0;

        while (true) {
            // Trip the safety valve before making the request, so a cursor loop
            // can't get us past this point even once.
            if (++page > MAX_PAGES) {
                throw new BallDontLieException(
                    "BALLDONTLIE pagination exceeded " + MAX_PAGES
                    + " pages for " + basePath + " — possible cursor loop");
            }

            // UriBuilder handles query-string encoding for us. That matters because
            // BALLDONTLIE uses array-style params like seasons[]=2026, and raw
            // brackets in a URL are not actually legal — Spring's String-based
            // .uri() is lenient but breaks in subtle ways once you append more
            // params (like cursor) after them.
            //
            // currentCursor is captured as a final local so the lambda can use it;
            // the outer `cursor` variable is reassigned each iteration.
            final Integer currentCursor = cursor;
            R response = restClient.get()
                .uri(uriBuilder -> {
                    var b = uriBuilder.path(basePath)
                                      .queryParam("per_page", PER_PAGE);
                    if (extraParams != null) {
                        extraParams.forEach(b::queryParam);
                    }
                    if (currentCursor != null) {
                        b.queryParam("cursor", currentCursor);
                    }
                    return b.build();
                })
                .header("Authorization", apiKey)
                .retrieve()
                .body(responseType);

            // Defensive: an empty body would otherwise NPE on the extractors below.
            if (response == null) {
                break;
            }

            List<T> items = dataExtractor.apply(response);
            if (items != null) {
                all.addAll(items);
            }

            // null next_cursor = last page. Anything else = keep going.
            Integer next = cursorExtractor.apply(response);
            if (next == null) {
                break;
            }
            cursor = next;
        try {
                Thread.sleep(INTER_PAGE_DELAY_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        return all;
    }
}