package com.questify.api.services.implementation;

import lombok.extern.slf4j.Slf4j;
import org.opencv.core.*;
import org.opencv.features2d.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ImageMatchingService {

    static {
        // Load OpenCV native library
        nu.pattern.OpenCV.loadLocally();
    }

    private static final double MATCH_THRESHOLD = 0.65; // 65% similarity required
    private static final int MIN_GOOD_MATCHES = 10; // Minimum matches for positive identification

    /**
     * Compare user-uploaded image with stored painting image
     *
     * @param userImage User's photo (MultipartFile)
     * @param storedImagePath Path to reference painting image in MinIO
     * @return Match score between 0.0 and 1.0
     */
    public double compareImages(MultipartFile userImage, String storedImagePath) throws IOException {

        // Convert MultipartFile to temporary file
        Path tempUserImage = Files.createTempFile("user-upload-", ".jpg");
        try {
            userImage.transferTo(tempUserImage.toFile());

            // Load both images
            Mat imgUser = Imgcodecs.imread(tempUserImage.toString(), Imgcodecs.IMREAD_GRAYSCALE);
            Mat imgStored = Imgcodecs.imread(storedImagePath, Imgcodecs.IMREAD_GRAYSCALE);

            if (imgUser.empty() || imgStored.empty()) {
                log.error("Failed to load images for comparison");
                return 0.0;
            }

            double score = performFeatureMatching(imgUser, imgStored);

            // Cleanup
            imgUser.release();
            imgStored.release();

            return score;

        } finally {
            Files.deleteIfExists(tempUserImage);
        }
    }

    /**
     * Perform ORB (Oriented FAST and Rotated BRIEF) feature matching
     * ORB is patent-free alternative to SIFT/SURF
     */
    private double performFeatureMatching(Mat img1, Mat img2) {

        // Initialize ORB detector
        ORB detector = ORB.create(
                500, // Max features to detect
                1.2f, // Scale factor
                8, // Pyramid levels
                31, // Edge threshold
                0, // First level
                2, // WTA_K
                ORB.HARRIS_SCORE,
                31,
                20
        );

        // Detect keypoints and compute descriptors
        MatOfKeyPoint keypoints1 = new MatOfKeyPoint();
        MatOfKeyPoint keypoints2 = new MatOfKeyPoint();
        Mat descriptors1 = new Mat();
        Mat descriptors2 = new Mat();

        detector.detectAndCompute(img1, new Mat(), keypoints1, descriptors1);
        detector.detectAndCompute(img2, new Mat(), keypoints2, descriptors2);

        if (descriptors1.empty() || descriptors2.empty()) {
            log.warn("No features detected in one or both images");
            return 0.0;
        }

        // Match descriptors using BFMatcher with Hamming distance
        DescriptorMatcher matcher = DescriptorMatcher.create(DescriptorMatcher.BRUTEFORCE_HAMMING);
        List<MatOfDMatch> knnMatches = new ArrayList<>();

        try {
            matcher.knnMatch(descriptors1, descriptors2, knnMatches, 2);
        } catch (Exception e) {
            log.error("Feature matching failed", e);
            return 0.0;
        }

        // Apply Lowe's ratio test to filter good matches
        List<DMatch> goodMatches = new ArrayList<>();
        for (MatOfDMatch match : knnMatches) {
            DMatch[] matchArray = match.toArray();
            if (matchArray.length >= 2) {
                if (matchArray[0].distance < 0.75f * matchArray[1].distance) {
                    goodMatches.add(matchArray[0]);
                }
            }
        }

        // Calculate confidence score
        if (goodMatches.size() < MIN_GOOD_MATCHES) {
            log.info("Insufficient good matches: {} (need {})", goodMatches.size(), MIN_GOOD_MATCHES);
            return 0.0;
        }

        // Score based on ratio of good matches
        int totalKeypoints = Math.min(keypoints1.toArray().length, keypoints2.toArray().length);
        double matchRatio = (double) goodMatches.size() / totalKeypoints;

        // Normalize score between 0 and 1
        double score = Math.min(1.0, matchRatio * 2.0); // Scale up since perfect match is rare

        log.info("Image matching: {} good matches, score: {}", goodMatches.size(), score);

        // Cleanup
        keypoints1.release();
        keypoints2.release();
        descriptors1.release();
        descriptors2.release();
        detector.clear();

        return score;
    }

    /**
     * Check if match score meets threshold
     */
    public boolean isMatchValid(double score) {
        return score >= MATCH_THRESHOLD;
    }
}