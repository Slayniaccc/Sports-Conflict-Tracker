package com.slayniaccc.sportsconflicttracker;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class SanityCheckTest {

    @Test
    void toolchainWorks() {
        int result = 2 + 2;
        assertThat(result).isEqualTo(4);
    }
}
