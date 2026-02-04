package com.questify.api.services.implementation;

import io.minio.*;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioStorageService {

    private final MinioClient minioClient;

    @Value("${minio.bucket.name}")
    private String bucketName;

    @Value("${minio.endpoint.extern}")
    private String externalEndpoint;

    /**
     * Download image from MinIO to temporary local file for OpenCV processing
     *
     * @param objectName Path in MinIO bucket
     * @return Local file path
     */
    public String downloadImageToTemp(String objectName) throws Exception {

        // Create temp file
        Path tempFile = Files.createTempFile("painting-ref-", ".jpg");

        try (InputStream stream = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build())) {

            Files.copy(stream, tempFile, StandardCopyOption.REPLACE_EXISTING);

            log.info("Downloaded image from MinIO: {} -> {}", objectName, tempFile);
            return tempFile.toString();

        } catch (Exception e) {
            Files.deleteIfExists(tempFile);
            throw e;
        }
    }

    /**
     * Upload painting reference image to MinIO
     */
    public String uploadPaintingImage(MultipartFile file, String paintingKey) throws Exception {

        String objectName = "paintings/" + paintingKey + ".jpg";

        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        log.info("Uploaded painting image: {}", objectName);
        return objectName;
    }

    /**
     * Get public URL for image (for frontend display)
     */
    public String getImageUrl(String objectName) {
        return externalEndpoint + "/" + bucketName + "/" + objectName;
    }

    /**
     * Check if bucket exists, create if not
     */
    public void ensureBucketExists() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build()
            );

            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder().bucket(bucketName).build()
                );
                log.info("Created MinIO bucket: {}", bucketName);
            }
        } catch (Exception e) {
            log.error("Failed to ensure bucket exists", e);
        }
    }

    /**
     * Delete temporary file after OpenCV processing
     */
    public void deleteTempFile(String filePath) {
        try {
            Files.deleteIfExists(Path.of(filePath));
        } catch (IOException e) {
            log.warn("Failed to delete temp file: {}", filePath, e);
        }
    }
}